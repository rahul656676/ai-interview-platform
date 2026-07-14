import {useState} from "react";

import axios from "axios";

import * as pdfjsLib from "pdfjs-dist";

import pdfWorker from "pdfjs-dist/build/pdf.worker.min.js?url";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  pdfWorker;

export default function Interview(){

  const [resumeText,setResumeText] =
    useState("");

  const [questions,setQuestions] =
    useState([]);

  const [loading,setLoading] =
    useState(false);

  // PDF UPLOAD

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
        let i=1;
        i<=pdf.numPages;
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

  // GENERATE INTERVIEW

  const generateInterview = async()=>{

    try{

      setLoading(true);

      const res = await axios.post(

        import.meta.env.VITE_API_URL + "/api/interview/start",

        {
          resumeText
        }

      );

      setQuestions(
        res.data.questions
      );

      setLoading(false);

    }catch(err){

      console.log(err);

      alert("AI Error");

      setLoading(false);

    }

  };

  return(

    <div style={{

      background:"#0f1117",

      minHeight:"100vh",

      color:"white",

      padding:"40px"

    }}>

      <h1>
        AI Interview Generator
      </h1>

      <div style={{

        marginTop:"25px",

        background:"#161b27",

        padding:"25px",

        borderRadius:"20px"

      }}>

        {/* BROWSE BUTTON */}

        <label style={{

          display:"inline-block",

          padding:"14px 24px",

          background:"#00e0b8",

          color:"black",

          borderRadius:"12px",

          cursor:"pointer",

          fontWeight:"bold",

          marginBottom:"20px"

        }}>

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

          onChange={(e)=>
            setResumeText(e.target.value)
          }

          placeholder="Paste Resume Here"

          style={{

            width:"100%",

            height:"250px",

            background:"#0f172a",

            color:"white",

            border:"1px solid #333",

            padding:"20px",

            borderRadius:"20px",

            marginTop:"10px"

          }}

        />

        {/* BUTTON */}

        <button

          onClick={generateInterview}

          style={{

            marginTop:"20px",

            padding:"15px 25px",

            border:"none",

            borderRadius:"12px",

            background:"#00e0b8",

            fontWeight:"bold",

            cursor:"pointer"

          }}

        >

          {

            loading

            ? "Generating..."

            : "Generate Interview"

          }

        </button>

      </div>

      {

        questions.length > 0 && (

          <div style={{

            marginTop:"40px",

            background:"#161b27",

            padding:"30px",

            borderRadius:"20px"

          }}>

            <h2>
              AI Questions
            </h2>

            {

              questions.map(
                (q,i)=>(

                  <div

                    key={i}

                    style={{

                      marginTop:"20px",

                      padding:"20px",

                      background:"#0f172a",

                      borderRadius:"15px"

                    }}

                  >

                    <b>
                      Q{i+1}:
                    </b>

                    <p style={{
                      marginTop:"10px"
                    }}>
                      {q}
                    </p>

                  </div>

                )
              )

            }

          </div>

        )

      }

    </div>

  );

}