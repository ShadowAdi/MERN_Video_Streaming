const mongoose = require("mongoose");
const userModel = require("../models/User.js");
const bcrypt = require("bcrypt");
const { createError } = require("../utils/Error.js");
const jwt = require("jsonwebtoken");

const Signup = async (req, res, next) => {
  try {
    const newPassoword = await bcrypt.hashSync(req?.body?.password, 10);
    const findUser = await userModel.findOne({ email: req?.body?.email });
    if (findUser) {
      next(createError(400, "User already exists"));
    }
    const newUser = new userModel({ ...req?.body, password: newPassoword });

    await newUser.save();

    res.json({
      status: 200,
      message: "User Created",
      newUser,
    });
  } catch (error) {
    next(error);
  }
};

const Signin = async (req, res, next) => {
  try {
    const User = await userModel.findOne({ name: req?.body?.name });
    if (!User) {
      next(createError(404, "User Not Found, Please Register"));
    }
    const isCorrect = await bcrypt.compare(req?.body.password, User?.password);

    if (!isCorrect) {
      next(createError(400, "Invalid Credentials"));
    }

    const token = jwt.sign({ id: User?._id }, process.env.JWT_SECRET);
    const { password, ...other } = User._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(other);
  } catch (error) {
    next(error);
  }
};

const GoogleLogin = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ email: req?.body?.email });
    if (user) {
      const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET);
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(user?._doc);
    } else {
      const newUser = new userModel({
        ...req.body,
        fromGoogle: true,
      });
      const savedUser = await newUser.save();

      const token = jwt.sign({ id: savedUser?._id }, process.env.JWT_SECRET);
      const { password, ...other } = savedUser._doc;

      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(other);
    }
  } catch (error) {}
};

const Logout = async (req, res) => {
  // Set token to none and expire after 5 seconds
  res.cookie("access_token", "none", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });
  res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
};

module.exports = {
  Signup,
  Signin,
  GoogleLogin,
  Logout,
};
