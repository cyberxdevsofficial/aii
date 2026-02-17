import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {

  try {
    const q = req.query.q || "Hello";

    const filePath = path.join(process.cwd(), "knowledge/data.json");
    const knowledge = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const system = `
Use this knowledge when answering:
${knowledge.facts.join("\n")}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: q }
      ]
    });

    res.status(200).json({
      question: q,
      answer: response.choices[0].message.content
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
