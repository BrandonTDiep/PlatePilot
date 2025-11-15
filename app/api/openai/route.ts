import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { RecipeSchema } from '@/schemas';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function createCompletionWithRetries(opts: {
  model: string;
  messages: { role: string; content: string }[];
  maxAttempts?: number;
}) {
  const attempts = opts.maxAttempts ?? 3;
  for (let i = 0; i < attempts; i++) {
    try {
      return await openai.chat.completions.create({
        model: opts.model,
        // cast to any to satisfy client types for message variants
        messages: opts.messages as unknown as never,
        response_format: { type: 'json_object' },
      });
    } catch (err) {
      // If it's a rate limit or recoverable network error, retry with backoff
      const maybe = err as { status?: number; message?: string } | undefined;
      const isRateLimit =
        maybe?.status === 429 || /rate limit/i.test(maybe?.message || '');
      const isNetwork = /network|timeout|ECONNRESET|ECONNREFUSED/i.test(
        maybe?.message || '',
      );

      if (i < attempts - 1 && (isRateLimit || isNetwork)) {
        const backoff = Math.pow(2, i) * 500; // 500ms, 1s, 2s
        await sleep(backoff);
        continue;
      }

      throw err;
    }
  }

  throw new Error('Failed to get completion after retries');
}

export async function POST(req: Request) {
  const { ingredients } = await req.json();

  const model = process.env.MODEL || 'gpt-4';
  const systemPrompt =
    process.env.OPENAI_PROMPT || 'You are a helpful assistant.';

  try {
    const response = await createCompletionWithRetries({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: ingredients },
      ],
      maxAttempts: 3,
    });

    const recipeCreated = response.choices?.[0]?.message?.content;

    if (!recipeCreated) {
      throw new Error('Recipe could not be generated');
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(recipeCreated);
    } catch (err) {
      console.error('Failed to parse model response as JSON', err);
      return NextResponse.json(
        { error: 'Invalid response from model' },
        { status: 500 },
      );
    }

    // Validate against schema
    try {
      const valid = RecipeSchema.parse(parsed);

      const finalRecipe = {
        ...valid,
        id: uuidv4(),
      };

      return NextResponse.json({ recipe: finalRecipe }, { status: 200 });
    } catch (err) {
      console.error('Recipe failed validation', err);
      return NextResponse.json(
        { error: 'Model returned invalid recipe format' },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes.' },
      { status: 500 },
    );
  }
}
