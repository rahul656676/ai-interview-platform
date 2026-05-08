const express = require("express");

const Groq = require("groq-sdk");

const router = express.Router();

const groq = new Groq({

  apiKey:
    process.env.GROQ_API_KEY

});

router.post("/start", async (req, res) => {

  try {

    const { resumeText } = req.body;

    const prompt = `

You are an expert AI interviewer.

Based on the following resume,
generate EXACTLY 7 interview questions.

Rules:
- Return ONLY JSON
- No markdown
- No explanation
- Questions must be detailed
- Include:
  1 HR question
  2 project questions
  2 technical questions
  1 strengths/weakness question
  1 future goals question

Format:

{
  "questions":[
    "question 1",
    "question 2",
    "question 3",
    "question 4",
    "question 5",
    "question 6",
    "question 7"
  ]
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
            role:"user",
            content:prompt
          }

        ],

        temperature:0.5

      });

    const text =
      completion.choices[0]
      .message.content;

    const cleaned =
      text
      .replace(/```json/g,"")
      .replace(/```/g,"")
      .trim();

    let result =
      JSON.parse(cleaned);

    // SAFETY FIX

    if(
      !result.questions
      ||
      result.questions.length < 7
    ){

      result.questions = [

        "Tell me about yourself.",

        "Explain one challenging project from your resume.",

        "What technologies did you use in your AI project and why?",

        "Explain the difference between supervised and unsupervised learning.",

        "How would you optimize a slow backend API?",

        "What are your biggest strengths and weaknesses?",

        "Where do you see yourself in the next five years?"

      ];

    }

    res.json(result);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message:
      "Interview Generation Failed"
    });

  }

});

module.exports = router;