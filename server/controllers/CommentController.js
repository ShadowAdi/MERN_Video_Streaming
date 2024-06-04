const { Comment } = require("../models/Comment");
const { VideoModel } = require("../models/Video");
const { createError } = require("../utils/Error.js");

const AddComment = async (req, res, next) => {
  try {
    const userId = req?.user?.id;
    const newComment = new Comment({ ...req?.body, userId });
    const savedComment = await newComment.save();
    res.status(200).json(savedComment);
  } catch (error) {
    next(error);
  }
};

const GetComment = async (req, res, next) => {
  try {
    const videoId = req?.params?.videoId;
    const comment = await Comment.find({ videoId: videoId });
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

const DeleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const Video = await VideoModel.findById(req.params.id);

    if (req.user.id === comment.userId || req.user.id === Video.userId) {
      await Comment.findByIdAndDelete(req?.params?.id);
      res.status(200).json("Comment has been deleted");
    } else {
      next(createError(400, "You Can Only Delete Your Comment"));
    }
  } catch (error) {
    next(error);
  }
};

const UpdateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (req.user.id === comment.userId) {
      const UpdatedComment = await Comment.findByIdAndUpdate(
        req?.params?.id,
        {
          $set: req?.body,
        },
        {
          new: true,
        }
      );
      res.status(200).json(UpdatedComment);
    } else {
      next(createError(400, "You Can Only Update Your Comment"));
    }
  } catch (error) {
    next(error);
  }
};

const LikeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment?.Likes?.includes(req?.user?.id)) {
      await Comment.findByIdAndUpdate(req?.params?.id, {
        $pull: { Likes: req?.user?.id },
      });
      return res.status(200).json("You DisLike The Comment");
    }
    else{

      await Comment.findByIdAndUpdate(req?.params?.id, {
        $push: { Likes: req?.user?.id },
      });
      return res.status(200).json("You Like The Comment");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  AddComment,
  DeleteComment,
  GetComment,
  UpdateComment,
  LikeComment,
};
