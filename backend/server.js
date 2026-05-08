const express = require("express");

const cors = require("cors");

const mongoose = require("mongoose");

require("dotenv").config();

const authRoutes =
require("./routes/auth");

const resumeRoutes =
require("./routes/resume");

const interviewRoutes =
require("./routes/interview");

const voiceRoutes =
require("./routes/voice");

const sarvamRoutes =
require("./routes/sarvam");

const app = express();

// MIDDLEWARE

app.use(cors());

app.use(express.json({
  limit:"10mb"
}));

// DATABASE

mongoose.connect(
  process.env.MONGO_URI
)
.then(()=>{

  console.log(
    "MongoDB Connected"
  );

})
.catch((err)=>{

  console.log(err);

});

// TEST ROUTE

app.get("/",(req,res)=>{

  res.json({

    message:
    "AI Interview Backend Running"

  });

});

// ROUTES

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/resume",
  resumeRoutes
);

app.use(
  "/api/interview",
  interviewRoutes
);

app.use(
  "/api/voice",
  voiceRoutes
);

app.use(
  "/api/sarvam",
  sarvamRoutes
);

// SERVER

app.listen(

  process.env.PORT || 3000,

  ()=>{

    console.log(
      "Server Running On Port 3000"
    );

  }

);