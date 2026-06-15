import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

const openai = new OpenAI();

app.post("/api/nudge", async (req, res) => {
  const { complaint } = req.body;

  if (!complaint || typeof complaint !== "string") {
    return res.status(400).json({ error: "complaint is required" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a relationship mediator. Your job is to take a complaint someone has about their partner and rewrite it as a gentle, constructive suggestion. Be empathetic, avoid blame, and focus on actionable advice. Keep the response to 2-3 sentences.",
        },
        { role: "user", content: complaint },
      ],
    });

    const suggestion = response.choices[0]?.message?.content ?? "";
    res.json({ suggestion });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "Failed to generate suggestion" });
  }
});

const port = process.env.PORT ?? 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
