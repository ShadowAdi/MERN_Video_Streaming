const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    img: {
      type: String,
      default:"https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg"
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    subscribedUsers: {
      type: [String],
    },
    fromGoogle: {
      type: Boolean,
      default: false,
    },
    history: [
      {
        video: { type: Schema.Types.ObjectId, ref: "Video" },
        watchedAt: { type: Date, default: Date.now },
      },
    ],
    watchLater: [{ type: Schema.Types.ObjectId, ref: "Video" }],
  },
  {
    timestamps: true,
  }
);

const userModel = new mongoose.model("User", UserSchema);
module.exports = userModel;
