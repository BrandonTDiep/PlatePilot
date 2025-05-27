import OpenAI from "openai"
import { NextResponse } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
})


export async function POST(req: Request) {
    
    const { ingredients } = await req.json()

    const model = process.env.MODEL || "gpt-4"  
    const systemPrompt = process.env.OPENAI_PROMPT || "You are a helpful assistant."

    try {
        const response = await openai.chat.completions.create({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: ingredients },
            ],
            response_format: { type: 'json_object' },
          });
          
        const recipeCreated = response.choices[0].message.content 
        
        if(!recipeCreated) {
            throw new Error("Recipe could not be generated")
        }

        const recipe = JSON.parse(recipeCreated)

        return NextResponse.json({ recipe }, { status: 200 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch recipes." }, { status: 500 })
    }
    
}