const userModel = require("../models/User");
const { VideoModel } = require("../models/Video.js");
const { createError } = require("../utils/Error");

const createVideo = async (req, res, next) => {
  const NewVideo = new VideoModel({
    userId: req?.user?.id,
    ...req?.body,
  });

  try {
    const savedVideo = await NewVideo.save();
    res.status(200).json(savedVideo);
  } catch (error) {
    next(error);
  }
};

const getVideo = async (req, res, next) => {
  try {
    const Video = await VideoModel.findById(req?.params?.id);
    if (!Video) return next(createError(404, "No Video Found"));
    res.status(200).json(Video);
  } catch (error) {
    next(error);
  }
};

const updateVideo = async (req, res, next) => {
  try {
    const Video = await VideoModel.findById(req?.params?.id);
    if (!Video) return next(createError(404, "No Video Found"));
    if (req?.user?.id === Video?.userId) {
      const updatedVideo = await VideoModel.findByIdAndUpdate(
        req?.params?.id,
        {
          $set: req?.body,
        },
        {
          new: true,
        }
      );
      res?.status(200).json(updatedVideo);
    } else {
      return next(createError(403, "You Can only update your video"));
    }
  } catch (error) {
    next(error);
  }
};

const DeleteVideo = async (req, res, next) => {
  try {
    const Video = await VideoModel.findById(req?.params?.id);
    if (!Video) return next(createError(404, "No Video Found"));
    if (req?.user?.id === Video?.userId) {
      const deleted = await VideoModel.findByIdAndDelete(req?.params?.id);
      res?.status(200).json(deleted);
    } else {
      return next(createError(403, "You Can only update your video"));
    }
  } catch (error) {
    next(error);
  }
};

const Random = async (req, res, next) => {
  try {
    const Videos = await VideoModel.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(Videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    next(error);
  }
};

const AddView = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;
    const userId = req.user.id;

    const video = await VideoModel.findById(videoId);

    if (!video) {
      return next(createError(404, "Video Not Found"));
    }

    // Check if the user has already viewed the video
    let isVideoIncludes = video.viewedBy.includes(userId);
    if (!isVideoIncludes) {
      video.viewedBy.push(userId);
      video.views += 1;
      await video.save();
    }

    const user = await userModel.findById(userId);
    const historyEntry = user?.history?.find(
      (entry) => entry.video.toString() === videoId
    );

    if (!historyEntry) {
      user?.history?.push({ video: videoId });
    } else {
      historyEntry.watchedAt = new Date();
    }
    await user.save();

    return res.status(200).json({ message: "View added successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const Trends = async (req, res, next) => {
  try {
    const videos = await VideoModel.find().sort({ views: -1 });
    res?.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

const Sub = async (req, res, next) => {
  try {
    const user = await userModel.findById(req?.user?.id);

    const SubscribedChannels = user?.subscribedUsers;

    const list = await Promise.all(
      SubscribedChannels.map((channelId) => {
        return VideoModel.find({
          userId: channelId,
        });
      })
    );
    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {
    next(error);
  }
};

const Tags = async (req, res, next) => {
  const tags = req.query.tags.split(",");
  try {
    const video = await VideoModel.find({ tags: { $in: tags } }).limit(20);
    res.status(200).json(video);
  } catch (error) {
    next(error);
  }
};

const Search = async (req, res, next) => {
  const q = req.query.q;

  try {
    const video = await VideoModel.find({
      title: { $regex: q, $options: "i" },
    }).limit(20);

    const channels = await userModel.find({
      name: { $regex: q, $options: "i" },
    });

    const channelIds = channels.map((channel) => channel._id);
    const videosByChannel = await VideoModel.find({
      userId: { $in: channelIds },
    }).limit(20);

    const videosByTags = await VideoModel.find({
      tags: { $regex: q, $options: "i" },
    }).limit(20);

    // Combine both results and remove duplicates
    const combinedResults = [
      ...video,
      ...videosByChannel,
      ...videosByTags,
    ];
    const uniqueResults = Array.from(
      new Set(combinedResults.map((video) => video._id))
    ).map((id) => combinedResults.find((video) => video._id.equals(id)));

    if (uniqueResults.length < 1) {
      return res.status(200).json({
        message: "No Videos Found, Reset Filters",
      });
    }

    return res.status(200).json(uniqueResults);
  } catch (error) {
    next(error);
  }
};

const Subscriber = async (req, res, next) => {
  const name = req.query.name;

  try {
    const userChannel = await userModel
      .find({
        name: { $regex: name, $options: "i" },
      })
      .limit(20);
    // if (video?.length < 1) {
    //   return res.status(200).json({
    //     message: "No Videos Found,Reset Filters",
    //   });
    // }
    const { password, ...other } = userChannel;
    const videos = await VideoModel.find({ userId: other["0"]._id });

    return res.status(200).json({ other, videos });
  } catch (error) {
    next(error);
  }
};

const GetHistory = async (req, res, next) => {
  try {
    const userId = req.user?.id; // Assuming user ID is stored in req.user

    const user = await userModel.findById(userId).populate("history.video");

    const today = [];
    const yesterday = [];
    const older = [];

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfYesterday = new Date(
      startOfToday.getTime() - 24 * 60 * 60 * 1000
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user?.history?.forEach((entry) => {
      const watchedAt = new Date(entry.watchedAt);
      if (watchedAt >= startOfToday) {
        today.push(entry);
      } else if (watchedAt >= startOfYesterday) {
        yesterday.push(entry);
      } else {
        older.push(entry);
      }
    });

    return res.status(200).json({ today, yesterday, older });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const LikedVideos = async (req, res) => {
  try {
    const userId = req.user.id;
    const likedVideos = await VideoModel.find({ likes: userId });
    res.status(200).json(likedVideos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const GetSingleChannel = async (req, res) => {
  try {
    const { id } = req?.params;
    const GetSingleVideos = await VideoModel.find({ userId: id });
    res.status(200).json(GetSingleVideos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createVideo,
  getVideo,
  updateVideo,
  DeleteVideo,
  Random,
  AddView,
  Trends,
  Sub,
  Tags,
  Search,
  Subscriber,
  GetHistory,
  LikedVideos,
  GetSingleChannel,
};
