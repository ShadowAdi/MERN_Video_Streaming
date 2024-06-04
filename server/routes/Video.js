const express = require("express");
const {
  createVideo,
  getVideo,
  updateVideo,
  DeleteVideo,
  Random,
  Trends,
  Sub,
  AddView,
  Tags,
  Search,
  GetHistory,
  LikedVideos,
  GetSingleChannel
} = require("../controllers/VideoController.js");
const { VerifyToken } = require("../utils/VerifyToken.js");

const router = express.Router();

router.post("/create", VerifyToken, createVideo);
router.get("/single/:id", getVideo); 
router.put("/update/:id", VerifyToken, updateVideo); 
router.delete("/delete/:id", VerifyToken, DeleteVideo); 
router.put("/view/:videoId", VerifyToken, AddView);
router.get("/random",   Random);
router.get("/trend", Trends);
router.get("/sub", VerifyToken, Sub);
router.get("/tags", Tags);
router.get("/search", Search);
router.get("/history", VerifyToken,GetHistory); 
router.get("/Liked", VerifyToken,LikedVideos);
router.get("/User/:id",GetSingleChannel)


module.exports = router;
