import { useState } from "react";

import axios from "axios";

import * as pdfjsLib from "pdfjs-dist";

import pdfWorker from "pdfjs-dist/build/pdf.worker.min.js?url";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  pdfWorker;

export default function Resume() {

  const [resumeText, setResumeText] =
    useState("");

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  // PDF

  const handlePDFUpload = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    try {

      setLoading(true);

      const arrayBuffer =
        await file.arrayBuffer();

      const pdf =
        await pdfjsLib.getDocument({
          data: arrayBuffer
        }).promise;

      let text = "";

      for (
        let i = 1;
        i <= pdf.numPages;
        i++
      ) {

        const page =
          await pdf.getPage(i);

        const content =
          await page.getTextContent();

        const strings =
          content.items.map(
            item => item.str
          );

        text +=
          strings.join(" ");

      }

      setResumeText(text);

      setLoading(false);

    } catch (err) {

      console.log(err);

      alert("PDF Read Error");

      setLoading(false);

    }

  };

  // ANALYZE

  const analyzeResume = async () => {

    try {

      setLoading(true);

      const res = await axios.post(

        "http://localhost:3000/api/resume/analyze",

        {
          resumeText
        }

      );

      setResult(res.data);

      setLoading(false);

    } catch (err) {

      console.log(err);

      alert("AI Error");

      setLoading(false);

    }

  };

  return (

    <div style={{

      minHeight:"100vh",

      background:
      "linear-gradient(135deg,#020617,#071224,#0f172a)",

      color:"white",

      padding:"40px",

      fontFamily:"Arial"

    }}>

      {/* HEADER */}

      <div style={{

        marginBottom:"40px"

      }}>

        <h1 style={{

          fontSize:"42px",

          color:"#60a5fa",

          marginBottom:"10px"

        }}>

          Resume ATS Analyzer

        </h1>

        <p style={{

          color:"#94a3b8",

          fontSize:"18px"

        }}>

          Upload your resume and get AI-powered ATS feedback

        </p>

      </div>

      {/* MAIN CARD */}

      <div style={mainCard}>

        {/* UPLOAD */}

        <label style={uploadButton}>

          Browse Resume PDF

          <input

            type="file"

            accept=".pdf,.txt"

            onChange={handlePDFUpload}

            hidden

          />

        </label>

        {/* TEXTAREA */}

        <textarea

          value={resumeText}

          onChange={(e) =>
            setResumeText(e.target.value)
          }

          placeholder="Resume content..."

          style={textareaStyle}

        />

        {/* BUTTON */}

        <button

          onClick={analyzeResume}

          disabled={loading}

          style={analyzeButton}

        >

          {

            loading

              ? "Analyzing..."

              : "Analyze Resume"

          }

        </button>

      </div>

      {/* RESULT */}

      {

        result && (

          <div style={resultCard}>

            {/* SCORE */}

            <div style={scoreBox}>

              <h2 style={{

                color:"#93c5fd"

              }}>

                ATS Score

              </h2>

              <h1 style={{

                fontSize:"60px",

                marginTop:"10px",

                color:"#60a5fa"

              }}>

                {result.overallScore}%

              </h1>

            </div>

            {/* STRENGTHS */}

            <div style={sectionBox}>

              <h2 style={sectionTitle}>
                Strengths
              </h2>

              {

                result.strengths.map(
                  (s, i) => (

                    <div
                      key={i}
                      style={itemStyle}
                    >

                      ✓ {s}

                    </div>

                  )
                )

              }

            </div>

            {/* WEAKNESSES */}

            <div style={sectionBox}>

              <h2 style={sectionTitle}>
                Weaknesses
              </h2>

              {

                result.weaknesses.map(
                  (w, i) => (

                    <div
                      key={i}
                      style={itemStyle}
                    >

                      • {w}

                    </div>

                  )
                )

              }

            </div>

            {/* KEYWORDS */}

            <div style={sectionBox}>

              <h2 style={sectionTitle}>
                Keywords
              </h2>

              <div style={{

                display:"flex",

                flexWrap:"wrap",

                gap:"12px",

                marginTop:"20px"

              }}>

                {

                  result.keywords.map(
                    (k, i) => (

                      <div

                        key={i}

                        style={keywordStyle}

                      >

                        {k}

                      </div>

                    )
                  )

                }

              </div>

            </div>

          </div>

        )

      }

    </div>

  );

}

// STYLES

const mainCard = {

  background:
  "rgba(15,23,42,0.95)",

  border:
  "1px solid #1d4ed8",

  borderRadius:"28px",

  padding:"35px",

  boxShadow:
  "0 0 40px rgba(37,99,235,0.18)"

};

const uploadButton = {

  display:"inline-block",

  background:
  "linear-gradient(90deg,#2563eb,#3b82f6)",

  padding:"15px 24px",

  borderRadius:"14px",

  cursor:"pointer",

  fontWeight:"bold",

  marginBottom:"25px"

};

const textareaStyle = {

  width:"100%",

  height:"260px",

  background:"#020617",

  border:"1px solid #1d4ed8",

  borderRadius:"18px",

  color:"white",

  padding:"20px",

  fontSize:"15px",

  outline:"none"

};

const analyzeButton = {

  marginTop:"25px",

  width:"100%",

  padding:"18px",

  border:"none",

  borderRadius:"16px",

  background:
  "linear-gradient(90deg,#2563eb,#60a5fa)",

  color:"white",

  fontSize:"17px",

  fontWeight:"bold",

  cursor:"pointer"

};

const resultCard = {

  marginTop:"40px",

  background:
  "rgba(15,23,42,0.95)",

  border:
  "1px solid #2563eb",

  borderRadius:"28px",

  padding:"35px",

  boxShadow:
  "0 0 40px rgba(37,99,235,0.18)"

};

const scoreBox = {

  textAlign:"center",

  marginBottom:"40px"

};

const sectionBox = {

  marginTop:"35px"

};

const sectionTitle = {

  color:"#60a5fa",

  fontSize:"26px",

  marginBottom:"18px"

};

const itemStyle = {

  background:"#020617",

  border:"1px solid #1d4ed8",

  padding:"16px",

  borderRadius:"14px",

  marginBottom:"14px",

  color:"#dbeafe"

};

const keywordStyle = {

  background:
  "linear-gradient(90deg,#1d4ed8,#2563eb)",

  padding:"10px 18px",

  borderRadius:"999px",

  color:"white",

  fontWeight:"bold"

};