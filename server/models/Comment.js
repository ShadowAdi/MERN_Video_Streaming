const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    videoId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    Likes:{
      type:[mongoose.Schema.Types.ObjectId],
      ref:"User"
    }
  },
  {
    timestamps: true,
  }
);

const Comment = new mongoose.model("Comment", CommentSchema);
module.exports={Comment}