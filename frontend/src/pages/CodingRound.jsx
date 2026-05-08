import Editor
from "@monaco-editor/react";

export default function CodingRound(){

  return(

    <div style={{

      minHeight:"100vh",

      background:"#020617",

      padding:"30px",

      color:"white"

    }}>

      <h1 style={{

        color:"#60a5fa",

        marginBottom:"20px"

      }}>

        Live Coding Interview
      </h1>

      <Editor

        height="80vh"

        defaultLanguage="javascript"

        defaultValue={`function solve(){

}`}

        theme="vs-dark"

      />

    </div>

  );

}