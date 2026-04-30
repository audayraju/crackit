import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { prompt, image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const defaultPrompt = "Analyze this screenshot from a technical interview. The user is asking for a hint or help answering the current question on screen. Provide a brief, concise, and helpful response.";
    const textPrompt = prompt || defaultPrompt;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-1.5-flash-8b",
        messages: [{
          role: "user",
          content: [
            {
              type: "text",
              text: textPrompt
            },
            {
              type: "image_url",
              image_url: {
                url: image
              }
            }
          ]
        }]
      })
    });
    
    if (!response.ok) {
      const text = await response.text();
      console.error("OpenRouter Vision API Error:", text);
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
    console.error("AI Vision Error:", error);
    return NextResponse.json({ error: 'Failed to generate vision content', details: error.message }, { status: 500 });
  }
}
