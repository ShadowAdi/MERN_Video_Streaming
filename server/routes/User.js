const express = require("express");
const {
  UpdateUser,
  GetUsers,
  GetUser,
  DeleteUser,
  SubscribeChannel,
  UnSubscribeChannel,
  LikeVideo,
  DisLikeVideo,
  SubscribedChannels,
} = require("../controllers/UserController.js");
const { VerifyToken } = require("../utils/VerifyToken.js");

const router = express.Router();

router.put("/:id", VerifyToken, UpdateUser); 
router.get("/All", GetUsers);
router.get("/:id", GetUser); 
router.delete("/:id", VerifyToken, DeleteUser); 
router.put("/sub/:id", VerifyToken,SubscribeChannel);
router.put("/unsub/:id", VerifyToken,UnSubscribeChannel);
router.put("/like/:videoId", VerifyToken,LikeVideo);
router.put("/Dislike/:videoId", VerifyToken,DisLikeVideo);
router.get("/subscribed/users",VerifyToken,SubscribedChannels );
router.get("/subscribed/users",VerifyToken,SubscribedChannels );





module.exports = router;
