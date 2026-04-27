import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// OpenRouter API (OpenAI-compatible)
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Free models to try in order
const FREE_MODELS = [
  "google/gemma-4-31b-it:free",
  "google/gemma-4-26b-a4b-it:free",
  "qwen/qwen3-coder:free",
  "openai/gpt-oss-20b:free",
];

async function callWithFallback(prompt) {
  for (const model of FREE_MODELS) {
    try {
      console.log(`Trying model: ${model}`);
      const response = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.log(`Model ${model} failed: ${error.message}`);
      // Continue to next model for any error
      continue;
    }
  }
  throw new Error("All models failed. Please try again in a minute.");
}

app.post("/interview", async (req, res) => {
  const { message, role = "Software Developer" } = req.body;

  const prompt = `
You are a senior interviewer for a ${role} position.
Ask interview questions and evaluate answers professionally.

User: ${message}

Respond with:
1. **Feedback** - Evaluate the answer
2. **Better Answer** - Provide an improved version
3. **Tips** - Give helpful tips for improvement
`;

  try {
    const reply = await callWithFallback(prompt);
    res.json({ reply });
  } catch (error) {
    console.error("OpenRouter Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
