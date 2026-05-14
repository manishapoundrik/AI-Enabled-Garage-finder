import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/ask", async (req, res) => {
  const { question } = req.body;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `You are a professional roadside mechanic.

Rules:
- Do NOT repeat the same answer
- Give clear and practical steps
- Keep answer short and useful

Problem: ${question}

Answer:`,
          parameters: {
            max_new_tokens: 120,
            temperature: 0.7,
          },
        }),
      }
    );

    const data: any = await response.json();

    console.log("HF RESPONSE:", data);

    // 🚨 HANDLE ALL CASES
    let reply = "";

    if (Array.isArray(data) && data[0]?.generated_text) {
      reply = data[0].generated_text;
    } else if (data?.error) {
      reply = "⚠️ AI is loading, please try again in a moment.";
    } else {
      reply = `Based on your issue "${question}", check fuel, battery, tyre condition or contact a mechanic.`;
    }

    res.json({ reply });

  } catch (error) {
    console.error("HF AI Error:", error);

    res.json({
      reply: `Based on your issue "${question}", check fuel, battery or nearby mechanic.`,
    });
  }
});

export default router;