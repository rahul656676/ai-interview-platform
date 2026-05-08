const express = require("express");

const axios = require("axios");

require("dotenv").config();

const router = express.Router();

router.post(
  "/speak",
  async(req,res)=>{

    try{

      const {text} =
        req.body;

      const response =
        await axios.post(

          "https://api.sarvam.ai/text-to-speech",

          {

            inputs:[text],

            target_language_code:"en-IN",

            speaker:"meera",

            pitch:0,

            pace:1,

            loudness:1,

            speech_sample_rate:22050,

            enable_preprocessing:true,

            model:"bulbul:v2"

          },

          {

            headers:{

              "Content-Type":
              "application/json",

              "api-subscription-key":
              process.env.SARVAM_API_KEY

            }

          }

        );

      const audioBase64 =

        response.data.audios[0];

      res.json({

        audio:audioBase64

      });

    }catch(err){

      console.log(

        err.response?.data
        ||
        err.message

      );

      res.status(500).json({

        error:"Sarvam Voice Error"

      });

    }

  }
);

module.exports = router;