const express = require("express");
const {
  AddComment,
  UpdateComment,
  DeleteComment,
  GetComment,
  LikeComment,
} = require("../controllers/CommentController.js");
const { VerifyToken } = require("../utils/VerifyToken.js");

const router = express.Router();

router.post("/add", VerifyToken, AddComment); 
router.get("/:videoId", GetComment);
router.delete("/:id", VerifyToken, DeleteComment);  
router.put("/:id", VerifyToken, UpdateComment);  
router.put("/Like/:id", VerifyToken, LikeComment);  

module.exports = router;
