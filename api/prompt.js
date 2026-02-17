import "dotenv/config";
import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  try {
    const q = req.query.q || "Hello";

    // Load local knowledge
    const filePath = path.join(process.cwd(), "knowledge/data.json");
    const knowledge = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const systemText = knowledge.facts.join("\n");

    // Create Gemini client
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    // Send prompt to Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${systemText}\n\nUser Question: ${q}`
    });

    // Return JSON
    res.status(200).json({
      question: q,
      answer: response.text
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
