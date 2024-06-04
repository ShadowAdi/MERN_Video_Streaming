const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      default: "No Description",
    },
    imgUrl: {
      type: String,
      default:
        "https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg",
    },
    videoUrl: {
      type: String,
      required: true,
    },
    views: { type: Number, default: 0 },
    viewedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    tags: {
      type: [String],
      default: [],
    },
    likes: {
      type: [String],
      default: [],
    },
    dislikes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const VideoModel = new mongoose.model("Video", VideoSchema);
module.exports = { VideoModel };
