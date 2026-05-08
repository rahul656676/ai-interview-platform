const express = require("express");

const Groq = require("groq-sdk");

const Interview =
require("../models/Interview");

const router = express.Router();

const groq = new Groq({

  apiKey:
    process.env.GROQ_API_KEY

});

router.post("/analyze", async(req,res)=>{

  try{

    const {
      question,
      answer
    } = req.body;

    const prompt = `

You are an expert AI interviewer.

Question:
${question}

Candidate Answer:
${answer}

Analyze the answer professionally.

Evaluate:
- technical correctness
- communication
- confidence
- clarity
- depth

Return ONLY valid JSON.

Format:

{
  "score":"8/10",
  "strengths":[
    "a",
    "b"
  ],
  "weaknesses":[
    "a",
    "b"
  ],
  "feedback":"full professional feedback"
}

`;

    const completion =
      await groq.chat.completions.create({

        model:
          "llama-3.3-70b-versatile",

        messages:[

          {
            role:"user",
            content:prompt
          }

        ],

        temperature:0.4

      });

    const text =
      completion.choices[0]
      .message.content;

    const cleaned =
      text
      .replace(/```json/g,"")
      .replace(/```/g,"")
      .trim();

    const result =
      JSON.parse(cleaned);

    // SAVE TO DATABASE

    await Interview.create({

      userEmail:"demo@gmail.com",

      question,

      answer,

      feedback:result.feedback,

      score:result.score

    });

    res.json(result);

  }catch(err){

    console.log(err);

    res.status(500).json({

      message:
      "Voice Analysis Failed"

    });

  }

});

module.exports = router;