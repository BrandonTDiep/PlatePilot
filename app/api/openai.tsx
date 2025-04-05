import OpenAI from "openai"
import type { NextApiRequest, NextApiResponse } from "next";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
})

interface OpenAIRequest {
    prompt: string
}

interface ResponseData {
    message?: string
    error?: string
}

export default async function handler( req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" })
    }

    const { prompt } = req.body as OpenAIRequest
    const model = process.env.MODEL || "gpt-4"  
    const systemPrompt = process.env.OPENAI_PROMPT || "You are a helpful assistant."

    try {
        const response = await openai.chat.completions.create({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: prompt },
            ],
          });
          const message = response.choices[0]?.message?.content || 'No response'
          res.status(200).json({ message })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch recipes." })
    }
    
}