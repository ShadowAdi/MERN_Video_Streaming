const userModel = require("../models/User");
const { VideoModel } = require("../models/Video");
const { createError } = require("../utils/Error");

const UpdateUser = async (req, res, next) => {
  const { id } = req?.params;
  if (id === req?.user?.id) {
    const UserFound = await userModel.findById(id);
    if (!UserFound) {
      next(createError(404, "User Not Found"));
    }

    let UserUpdate = await userModel.findOneAndUpdate(
      { _id: id },
      {
        $set: req?.body,
      },
      {
        new: true,
      }
    );

    res.status(200).json(UserUpdate);
  } else {
    return next(createError(403, "You can update only your Account"));
  }
};

const GetUsers = async (req, res, next) => {
  const User = await userModel.find();

  res.status(200).json(User);
};

const GetUser = async (req, res, next) => {
  const { id } = req?.params;
  const UserFound = await userModel.findById(id);

  if (!UserFound) {
    next(createError(404, "User Not Found"));
  }

  res.status(200).json(UserFound?._doc);
};

const DeleteUser = async (req, res, next) => {
  const { id } = req?.params;

  const UserFound = await userModel.findById(id);
  if (!UserFound) {
    next(createError(404, "No User Found"));
  }
  if (id === req?.user?.id) {
    await userModel.findByIdAndDelete(id);
  } else {
    return next(createError(403, "You can Delete only your Account"));
  }

  res.status(200).json({ message: "User Deleted" });
};

const SubscribeChannel = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.id;
    const currentUser = await userModel.findById(currentUserId);

    if (currentUser.subscribedUsers.includes(targetUserId)) {
      return next(createError(400, "You Already  subscribe"));
    }
    await userModel.findByIdAndUpdate(currentUserId, {
      $push: { subscribedUsers: targetUserId },
    });
    await userModel.findByIdAndUpdate(targetUserId, {
      $inc: { subscribers: 1 },
    });
    res.status(200).json("Subscription successfull.");
  } catch (err) {
    next(err);
  }
};

const UnSubscribeChannel = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.id;
    const currentUser = await userModel.findById(currentUserId);

    if (!currentUser.subscribedUsers.includes(targetUserId)) {
      return next(createError(400, "You Don't subscribe the user"));
    }
    await userModel.findByIdAndUpdate(currentUserId, {
      $pull: {
        subscribedUsers: targetUserId,
      },
    });

    await userModel.findByIdAndUpdate(targetUserId, {
      $inc: {
        subscribers: -1,
      },
    });
    res.status(200).json("Channel UnSubscribed");
  } catch (error) {
    return next(createError(401, error));
  }
};

const LikeVideo = async (req, res, next) => {
  try {
    const id = req.user.id;
    const videoId = req.params.videoId;

    await VideoModel.findByIdAndUpdate(videoId, {
      $addToSet: { likes: id },
      $pull: { dislikes: id },
    });

    res.status(200).json("Video Liked");
  } catch (error) {
    return next(createError(401, error));
  }
};

const DisLikeVideo = async (req, res, next) => {
  try {
    const id = req.user.id;
    const videoId = req.params.videoId;

    await VideoModel.findByIdAndUpdate(videoId, {
      $addToSet: { dislikes: id },
      $pull: { likes: id },
    });

    res.status(200).json("Video DisLiked");
  } catch (error) {
    return next(createError(401, error));
  }
};

const SubscribedChannels = async (req, res, next) => {
  try {
    const id = req.user?.id;

    const userData = await userModel.findOne({ _id: id });

    if (!userData) {
      return next(createError(400, "No User Found"));
    }

    // Get the subscribed user IDs
    const subscribedUserIds = userData?.subscribedUsers;

    // Populate the subscribed users
    const populatedSubscribedUsers = await Promise.all(
      subscribedUserIds.map(async (userId) => {
        const user = await userModel.findById(userId);
        // Remove sensitive data like password
        const { password, ...userData } = user?._doc;
        return userData;
      })
    );

    res.status(200).json(populatedSubscribedUsers);
  } catch (error) {
    return next(createError(401, error));
  }
};

module.exports = {
  UpdateUser,
  GetUsers,
  GetUser,
  DeleteUser,
  SubscribeChannel,
  UnSubscribeChannel,
  LikeVideo,
  DisLikeVideo,
  SubscribedChannels,
};
