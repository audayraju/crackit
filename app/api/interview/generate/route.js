import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { prompt, message } = await req.json();
    const promptToUse = prompt || message;

    if (!promptToUse) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemma-2-9b-it:free",
        messages: [{
          role: "user",
          content: promptToUse
        }]
      })
    });
    
    if (!response.ok) {
      const text = await response.text();
      console.error("OpenRouter API Error:", text);
      throw new Error(`OpenRouter API returned ${response.status}`);
    }

    const aiResult = await response.json();
    const content = aiResult.choices?.[0]?.message?.content || "";

    return NextResponse.json({ 
      success: true, 
      response: content,
      reply: content
    });

  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: 'Failed to generate content', details: error.message }, { status: 500 });
  }
}
