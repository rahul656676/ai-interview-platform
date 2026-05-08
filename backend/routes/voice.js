const express = require("express");

const Groq = require("groq-sdk");

require("dotenv").config();

const router = express.Router();

const groq = new Groq({

  apiKey:
  process.env.GROQ_API_KEY

});

// =========================
// ANALYZE ANSWER
// =========================

router.post(
  "/analyze",
  async(req,res)=>{

    try{

      const {

        question,

        answer

      } = req.body;

      const completion =

        await groq.chat.completions.create({

          messages:[

            {

              role:"system",

              content:`

You are an AI interviewer.

Analyze the candidate answer.

Return ONLY valid JSON.

Format:

{
  "score":8,
  "strengths":[
    "Good communication"
  ],
  "weaknesses":[
    "Needs more depth"
  ],
  "feedback":"Good answer overall"
}

`

            },

            {

              role:"user",

              content:`

Question:
${question}

Answer:
${answer}

`

            }

          ],

          model:
          "llama-3.1-8b-instant",

          temperature:0.5,

          max_tokens:300

        });

      let text =

        completion
        .choices[0]
        .message
        .content;

      // CLEAN RESPONSE

      text = text

      .replace(/```json/g,"")

      .replace(/```/g,"")

      .trim();

      const result =
        JSON.parse(text);

      res.json(result);

    }catch(err){

      console.log(err);

      res.status(500).json({

        error:
        "AI Analysis Error"

      });

    }

  }
);

module.exports = router;
