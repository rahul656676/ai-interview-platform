const express = require("express");

const Groq = require("groq-sdk");

const router = express.Router();

const groq = new Groq({

  apiKey:
    process.env.GROQ_API_KEY

});

router.post("/analyze", async (req, res) => {

  try {

    const { resumeText } = req.body;

    if (!resumeText) {

      return res.status(400).json({
        message: "Resume text missing"
      });

    }

    const prompt = `

You are an ATS resume analyzer.

Analyze this resume and return ONLY valid JSON.

Format:

{
  "overallScore":90,
  "strengths":["a","b"],
  "weaknesses":["a","b"],
  "keywords":["a","b"]
}

Resume:

${resumeText}

`;

    const completion =
      await groq.chat.completions.create({

        model:
          "llama-3.3-70b-versatile",

        messages: [

          {
            role: "user",
            content: prompt
          }

        ],

        temperature: 0.3

      });

    const text =
      completion.choices[0]
      .message.content;

    const cleaned =
      text
      .replace(/```json/g, "")
      .replace(/```/g, "");

    const result =
      JSON.parse(cleaned);

    res.json(result);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "AI Analysis Failed"
    });

  }

});

module.exports = router;