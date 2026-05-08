const mongoose = require("mongoose");

const InterviewSchema =
new mongoose.Schema({

  userEmail:{
    type:String
  },

  question:{
    type:String
  },

  answer:{
    type:String
  },

  feedback:{
    type:String
  },

  score:{
    type:String
  }

},{
  timestamps:true
});

module.exports =
mongoose.model(
  "Interview",
  InterviewSchema
);