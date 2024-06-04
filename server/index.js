const express = require("express");
const mongoose = require("mongoose");
const CookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv").config();

const UserRouter = require("./routes/User.js");
const VideoRouter = require("./routes/Video.js");
const CommentRouter = require("./routes/Comments.js");
const AuthRouter = require("./routes/auth.js");

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Replace with your client's origin
  credentials: true
}));
app.use(CookieParser());
app.use(express.json());

app.use("/api/Auth", AuthRouter);
app.use("/api/users", UserRouter);
app.use("/api/videos", VideoRouter);
app.use("/api/comment", CommentRouter);

// Error handling middleware should be placed after all other middleware and routes
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';

  // Optional error logging
  console.error(err.stack);

  res.status(status).json({
    success: false,
    status,
    message,
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(8080, () => {
      console.log("DB Connected and server started");
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app; // If you need to import the app elsewhere
