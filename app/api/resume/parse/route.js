import { NextResponse } from 'next/server';
import PDFParser from 'pdf2json';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert the File object to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse the PDF using pdf2json
    const extractedText = await new Promise((resolve, reject) => {
      const pdfParser = new PDFParser(null, 1);
      
      pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
      pdfParser.on("pdfParser_dataReady", () => {
        resolve(pdfParser.getRawTextContent());
      });
      
      pdfParser.parseBuffer(buffer);
    });

    // Extract structure via OpenRouter AI
    let structuredData = null;
    try {
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
            content: `You are an expert ATS resume parser. Extract the following raw text into a strict JSON object. 
            Do NOT include markdown formatting or backticks, just output raw valid JSON.
            Required JSON structure:
            {
              "name": "Full Name",
              "email": "email@example.com",
              "phone": "phone number",
              "location": "City, State",
              "linkedin": "url",
              "github": "url",
              "summary": "Professional summary",
              "experiences": [ { "company": "", "title": "", "startDate": "", "endDate": "", "bullets": ["bullet 1"] } ],
              "education": [ { "school": "", "degree": "", "field": "", "graduationDate": "" } ],
              "skills": { "technical": ["skill1"], "soft": ["skill2"] },
              "projects": [ { "name": "", "description": "", "technologies": "", "link": "" } ]
            }
            
            RAW RESUME TEXT:
            ${extractedText}
            `
          }]
        })
      });
      if (!response.ok) {
        console.error("OpenRouter Error Response:", await response.text());
        throw new Error("OpenRouter API returned an error");
      }
      
      const aiResult = await response.json();
      const content = aiResult.choices?.[0]?.message?.content || "{}";
      
      // Clean up markdown code blocks if the AI accidentally included them
      let cleanJson = content.replace(/```json\n?|\n?```/gi, '').trim();
      
      // Extract just the JSON object if there is text around it
      const jsonStart = cleanJson.indexOf('{');
      const jsonEnd = cleanJson.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanJson = cleanJson.substring(jsonStart, jsonEnd + 1);
      }
      
      structuredData = JSON.parse(cleanJson);
      
      // If the parsed object is basically empty, treat it as failure so we fallback to raw text
      if (Object.keys(structuredData).length === 0 || (!structuredData.name && !structuredData.experiences)) {
        structuredData = null;
      }
    } catch (e) {
      console.error("AI Structuring failed:", e.message);
      structuredData = null;
    }

    return NextResponse.json({ 
      success: true, 
      text: extractedText,
      structuredData
    });

  } catch (error) {
    console.error("PDF Parsing Error:", error);
    return NextResponse.json({ error: 'Failed to parse PDF', details: error.message }, { status: 500 });
  }
}
