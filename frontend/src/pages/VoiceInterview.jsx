// frontend/src/pages/VoiceInterview.jsx

import { useState } from "react";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.js?url";

import EmotionDetector from "../components/EmotionDetector";
import HRAvatar from "../components/HRAvatar";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  pdfWorker;

export default function VoiceInterview(){

  const [resumeText,setResumeText] =
    useState("");

  const [questions,setQuestions] =
    useState([]);

  const [currentIndex,setCurrentIndex] =
    useState(0);

  const [currentQuestion,setCurrentQuestion] =
    useState("");

  const [answer,setAnswer] =
    useState("");

  const [feedback,setFeedback] =
    useState("");

  const [loading,setLoading] =
    useState(false);

  const [listening,setListening] =
    useState(false);

  // =========================
  // AI VOICE
  // =========================

  const speak = (text,callback)=>{

    speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";

    utterance.rate = 1;

    utterance.pitch = 1;

    utterance.volume = 1;

    speechSynthesis.speak(utterance);

    utterance.onend = ()=>{

      if(callback){

        callback();

      }

    };

  };

  // =========================
  // PDF READ
  // =========================

  const handlePDFUpload = async(e)=>{

    const file = e.target.files[0];

    if(!file) return;

    try{

      setLoading(true);

      const arrayBuffer =
        await file.arrayBuffer();

      const pdf =
        await pdfjsLib.getDocument({
          data:arrayBuffer
        }).promise;

      let text = "";

      for(
        let i = 1;
        i <= pdf.numPages;
        i++
      ){

        const page =
          await pdf.getPage(i);

        const content =
          await page.getTextContent();

        const strings =
          content.items.map(
            item=>item.str
          );

        text +=
          strings.join(" ");

      }

      setResumeText(text);

      setLoading(false);

    }catch(err){

      console.log(err);

      alert("PDF Read Error");

      setLoading(false);

    }

  };

  // =========================
  // GENERATE QUESTIONS
  // =========================

  const generateInterview = async()=>{

    try{

      setLoading(true);

      const res = await axios.post(

        "http://localhost:3000/api/interview/start",

        {
          resumeText
        }

      );

      const qs =
        res.data.questions;

      setQuestions(qs);

      setCurrentIndex(0);

      setCurrentQuestion(qs[0]);

      setLoading(false);

      askQuestion(qs[0]);

    }catch(err){

      console.log(err);

      alert("Interview Generation Error");

      setLoading(false);

    }

  };

  // =========================
  // ASK QUESTION
  // =========================

  const askQuestion = (question)=>{

    setAnswer("");

    setFeedback("");

    speak(question,()=>{

      startListening();

    });

  };

  // =========================
  // SPEECH RECOGNITION
  // =========================

  const startListening = ()=>{

    const SpeechRecognition =

      window.SpeechRecognition
      ||
      window.webkitSpeechRecognition;

    if(!SpeechRecognition){

      alert(
        "Speech Recognition Not Supported"
      );

      return;

    }

    setAnswer("");

    setFeedback("");

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.maxAlternatives = 1;

    let finalTranscript = "";

    setListening(true);

    recognition.start();

    // LIVE TRANSCRIPT

    recognition.onresult =
    async(event)=>{

      let transcript = "";

      for(

        let i = 0;

        i < event.results.length;

        i++

      ){

        transcript +=

          event.results[i][0]
          .transcript + " ";

        if(event.results[i].isFinal){

          finalTranscript +=

            event.results[i][0]
            .transcript + " ";

        }

      }

      setAnswer(transcript);

    };

    // USER STOPPED SPEAKING

    recognition.onspeechend =
    async()=>{

      recognition.stop();

      setListening(false);

      if(

        !finalTranscript
        ||
        finalTranscript.trim() === ""

      ){

        setFeedback(

          "No answer detected. Please speak louder."

        );

        return;

      }

      setAnswer(finalTranscript);

      await analyzeAnswer(
        finalTranscript
      );

    };

    // ERROR

    recognition.onerror =(event)=>{

      console.log(event.error);

      setListening(false);

      setFeedback(

        "Microphone permission denied or no speech detected."

      );

    };

    // AUTO STOP

    setTimeout(()=>{

      recognition.stop();

    },20000);

  };

  // =========================
  // ANALYZE ANSWER
  // =========================

  const analyzeAnswer = async(text)=>{

    try{

      const res = await axios.post(

        "http://localhost:3000/api/voice/analyze",

        {

          question:currentQuestion,

          answer:text

        }

      );

      const data =
        res.data;

      const finalFeedback = `

Score: ${data.score}/10

Strengths:
${data.strengths.join(". ")}

Weaknesses:
${data.weaknesses.join(". ")}

Feedback:
${data.feedback}

`;

      setFeedback(finalFeedback);

      speak(finalFeedback,()=>{

        moveToNextQuestion();

      });

    }catch(err){

      console.log(err);

      setFeedback(
        "AI analysis failed."
      );

    }

  };

  // =========================
  // NEXT QUESTION
  // =========================

  const moveToNextQuestion = ()=>{

    const next =
      currentIndex + 1;

    if(next >= questions.length){

      speak(

        "Interview completed successfully. Redirecting to report.",

        ()=>{

          alert(
            "Interview Completed"
          );

        }

      );

      return;

    }

    setCurrentIndex(next);

    const nextQuestion =
      questions[next];

    setCurrentQuestion(
      nextQuestion
    );

    setTimeout(()=>{

      askQuestion(nextQuestion);

    },2000);

  };

  return(

    <div style={{

      minHeight:"100vh",

      background:
      "linear-gradient(135deg,#020617,#071127,#020617)",

      color:"white",

      padding:"40px",

      fontFamily:"Arial"

    }}>

      {/* HEADER */}

      <div style={{

        marginBottom:"40px"

      }}>

        <h1 style={{

          fontSize:"52px",

          color:"#60a5fa",

          marginBottom:"10px"

        }}>

          AI Voice Interview

        </h1>

        <p style={{

          opacity:0.7,

          fontSize:"20px"

        }}>

          Real-time AI Mock Interview Platform

        </p>

      </div>

      {/* TOP GRID */}

      <div style={{

        display:"grid",

        gridTemplateColumns:
        "1fr 1fr",

        gap:"30px"

      }}>

        {/* LEFT */}

        <div style={cardStyle}>

          <h2 style={titleStyle}>
            Upload Resume
          </h2>

          <label style={uploadStyle}>

            Browse Resume PDF

            <input

              type="file"

              accept=".pdf,.txt"

              onChange={handlePDFUpload}

              hidden

            />

          </label>

          <textarea

            value={resumeText}

            onChange={(e)=>
              setResumeText(e.target.value)
            }

            placeholder="Resume content..."

            style={textareaStyle}

          />

          <button

            onClick={generateInterview}

            style={buttonStyle}

          >

            {

              loading

              ? "Generating..."

              : "Start AI Interview"

            }

          </button>

        </div>

        {/* RIGHT */}

        <div style={cardStyle}>

          <h2 style={titleStyle}>
            Interview Status
          </h2>

          <div style={statusBox}>

            Question:
            {" "}
            {currentIndex + 1}
            /
            {questions.length || 7}

          </div>

          <div style={statusBox}>

            {

              listening

              ? "🎤 Listening..."

              : "⏳ Waiting..."

            }

          </div>

        </div>

      </div>

      {/* AI SECTION */}

      <div style={{

        display:"flex",

        gap:"30px",

        marginTop:"35px",

        flexWrap:"wrap"

      }}>

        <EmotionDetector/>

        <div style={cardStyle}>

          <h2 style={titleStyle}>
            AI HR Assistant
          </h2>

          <HRAvatar/>

        </div>

      </div>

      {/* QUESTION */}

      {

        currentQuestion && (

          <div style={bigCard}>

            <h2 style={titleStyle}>
              Current Question
            </h2>

            <p style={questionStyle}>
              {currentQuestion}
            </p>

          </div>

        )

      }

      {/* TRANSCRIPT */}

      {

        answer && (

          <div style={bigCard}>

            <h2 style={titleStyle}>
              Live Transcript
            </h2>

            <p style={textStyle}>
              {answer}
            </p>

          </div>

        )

      }

      {/* FEEDBACK */}

      {

        feedback && (

          <div style={bigCard}>

            <h2 style={titleStyle}>
              AI Feedback
            </h2>

            <pre style={feedbackStyle}>
              {feedback}
            </pre>

          </div>

        )

      }

    </div>

  );

}

// =========================
// STYLES
// =========================

const cardStyle = {

  background:
  "rgba(15,23,42,0.95)",

  border:
  "1px solid #2563eb",

  borderRadius:"24px",

  padding:"25px",

  boxShadow:
  "0 0 25px rgba(37,99,235,0.25)"

};

const bigCard = {

  background:
  "rgba(15,23,42,0.95)",

  border:
  "1px solid #2563eb",

  borderRadius:"24px",

  padding:"30px",

  marginTop:"30px"

};

const titleStyle = {

  color:"#60a5fa",

  marginBottom:"20px",

  fontSize:"24px"

};

const uploadStyle = {

  display:"inline-block",

  background:
  "linear-gradient(90deg,#2563eb,#3b82f6)",

  padding:"14px 22px",

  borderRadius:"14px",

  cursor:"pointer",

  fontWeight:"bold",

  marginBottom:"20px"

};

const textareaStyle = {

  width:"100%",

  height:"220px",

  background:"#020617",

  border:"1px solid #1d4ed8",

  color:"white",

  borderRadius:"16px",

  padding:"18px",

  fontSize:"15px",

  outline:"none"

};

const buttonStyle = {

  marginTop:"20px",

  width:"100%",

  padding:"16px",

  background:
  "linear-gradient(90deg,#2563eb,#60a5fa)",

  border:"none",

  borderRadius:"14px",

  color:"white",

  fontSize:"16px",

  fontWeight:"bold",

  cursor:"pointer"

};

const statusBox = {

  background:"#020617",

  border:"1px solid #2563eb",

  padding:"20px",

  borderRadius:"16px",

  marginBottom:"20px",

  fontSize:"18px"

};

const questionStyle = {

  fontSize:"24px",

  lineHeight:"1.7",

  color:"#e2e8f0"

};

const textStyle = {

  fontSize:"18px",

  lineHeight:"1.8",

  color:"#cbd5e1"

};

const feedbackStyle = {

  whiteSpace:"pre-wrap",

  color:"#bfdbfe",

  lineHeight:"1.8",

  fontSize:"16px"

};