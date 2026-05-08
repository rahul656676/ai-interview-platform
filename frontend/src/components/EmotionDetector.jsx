import { useEffect,useRef,useState }
from "react";

import * as faceapi
from "face-api.js";

export default function EmotionDetector(){

  const videoRef = useRef();

  const canvasRef = useRef();

  const [emotion,setEmotion] =
    useState("Starting Camera...");

  const [warning,setWarning] =
    useState("");

  useEffect(()=>{

    start();

  },[]);

  // =========================
  // START
  // =========================

  const start = async()=>{

    try{

      // LOAD MODELS

      await faceapi.nets.tinyFaceDetector
      .loadFromUri("/models");

      await faceapi.nets.faceExpressionNet
      .loadFromUri("/models");

      // CAMERA

      const stream =

        await navigator
        .mediaDevices
        .getUserMedia({

          video:true

        });

      videoRef.current.srcObject =
        stream;

      videoRef.current.onplay =
      ()=>{

        detect();

      };

    }catch(err){

      console.log(err);

      setWarning(
        "Camera Error"
      );

    }

  };

  // =========================
  // DETECT
  // =========================

  const detect = ()=>{

    setInterval(async()=>{

      if(!videoRef.current) return;

      const detection =

        await faceapi

        .detectSingleFace(

          videoRef.current,

          new faceapi
          .TinyFaceDetectorOptions({

            inputSize:224,

            scoreThreshold:0.5

          })

        )

        .withFaceExpressions();

      // NO FACE

      if(!detection){

        setEmotion("No Face");

        setWarning(
          "Face Not Detected"
        );

        return;

      }

      setWarning("");

      // EMOTION

      const expressions =
        detection.expressions;

      const maxEmotion =

        Object.keys(expressions)

        .reduce((a,b)=>

          expressions[a]
          >
          expressions[b]

          ? a
          : b

        );

      setEmotion(maxEmotion);

      // DRAW BOX

      const canvas =
        canvasRef.current;

      const displaySize = {

        width:320,

        height:240

      };

      faceapi.matchDimensions(
        canvas,
        displaySize
      );

      const resized =

        faceapi.resizeResults(

          detection,

          displaySize

        );

      const ctx =
        canvas.getContext("2d");

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      faceapi.draw.drawDetections(
        canvas,
        resized
      );

    },5000);

  };

  return(

    <div style={{

      background:
      "rgba(15,23,42,0.95)",

      border:
      "1px solid #2563eb",

      borderRadius:"24px",

      padding:"25px",

      width:"370px"

    }}>

      <h2 style={{

        color:"#60a5fa",

        marginBottom:"20px"

      }}>

        AI Proctoring System

      </h2>

      <div style={{

        position:"relative"

      }}>

        <video

          ref={videoRef}

          autoPlay

          muted

          width="320"

          height="240"

          style={{

            borderRadius:"18px",

            border:
            "2px solid #2563eb",

            objectFit:"cover"

          }}

        />

        <canvas

          ref={canvasRef}

          width="320"

          height="240"

          style={{

            position:"absolute",

            top:0,

            left:0

          }}

        />

      </div>

      <div style={{

        marginTop:"20px",

        background:"#020617",

        border:"1px solid #2563eb",

        padding:"16px",

        borderRadius:"14px"

      }}>

        Emotion:
        {" "}

        <span style={{

          color:"#60a5fa",

          fontWeight:"bold"

        }}>

          {emotion}

        </span>

      </div>

      {

        warning && (

          <div style={{

            marginTop:"20px",

            background:
            "rgba(255,0,0,0.15)",

            border:
            "1px solid red",

            color:"#ff6b6b",

            padding:"16px",

            borderRadius:"14px",

            fontWeight:"bold"

          }}>

            ⚠ {warning}

          </div>

        )

      }

    </div>

  );

}