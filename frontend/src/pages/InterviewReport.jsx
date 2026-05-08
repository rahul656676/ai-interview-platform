import jsPDF from "jspdf";

export default function InterviewReport(){

  const downloadReport = ()=>{

    const doc = new jsPDF();

    doc.setFontSize(24);

    doc.text(
      "AI Interview Report",
      20,
      25
    );

    doc.setFontSize(14);

    doc.text(
      "Candidate: Rahul",
      20,
      50
    );

    doc.text(
      "Overall Score: 8.5/10",
      20,
      65
    );

    doc.text(
      "Communication: Strong",
      20,
      80
    );

    doc.text(
      "Technical Skills: Good",
      20,
      95
    );

    doc.text(
      "Confidence: High",
      20,
      110
    );

    doc.text(
      "Weakness: System Design",
      20,
      125
    );

    doc.text(
      "AI Feedback:",
      20,
      150
    );

    doc.text(

      "Good communication and technical understanding. Improve answer depth and system design concepts.",

      20,

      165,

      {
        maxWidth:170
      }

    );

    doc.save(
      "AI_Interview_Report.pdf"
    );

  };

  return(

    <div style={{

      minHeight:"100vh",

      background:
      "linear-gradient(135deg,#020617,#071224,#0f172a)",

      color:"white",

      padding:"40px",

      fontFamily:"Arial"

    }}>

      <div style={{

        maxWidth:"700px",

        margin:"auto",

        background:
        "rgba(15,23,42,0.95)",

        border:
        "1px solid #2563eb",

        borderRadius:"30px",

        padding:"40px",

        boxShadow:
        "0 0 40px rgba(37,99,235,0.2)"

      }}>

        <h1 style={{

          color:"#60a5fa",

          fontSize:"42px",

          marginBottom:"20px"

        }}>

          Interview Report
        </h1>

        <p style={{

          color:"#94a3b8",

          fontSize:"18px",

          marginBottom:"35px"

        }}>

          Download your complete AI interview performance report.

        </p>

        <div style={cardStyle}>

          <h2>
            Overall Score
          </h2>

          <h1 style={{

            color:"#60a5fa",

            marginTop:"15px",

            fontSize:"55px"

          }}>

            8.5/10
          </h1>

        </div>

        <div style={cardStyle}>

          <h2>
            AI Feedback
          </h2>

          <p style={{

            marginTop:"15px",

            lineHeight:"1.8",

            color:"#cbd5e1"

          }}>

            Strong communication skills and technical understanding detected. Improve system design concepts and provide more real-world project examples for stronger interview performance.

          </p>

        </div>

        <button

          onClick={downloadReport}

          style={buttonStyle}

        >

          Download PDF Report

        </button>

      </div>

    </div>

  );

}

const cardStyle = {

  background:"#020617",

  border:"1px solid #1d4ed8",

  borderRadius:"20px",

  padding:"25px",

  marginBottom:"25px"

};

const buttonStyle = {

  width:"100%",

  padding:"18px",

  border:"none",

  borderRadius:"16px",

  background:
  "linear-gradient(90deg,#2563eb,#3b82f6)",

  color:"white",

  fontSize:"18px",

  fontWeight:"bold",

  cursor:"pointer"

};