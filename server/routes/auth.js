const express=require("express")
const  { Signup, Signin, GoogleLogin,Logout }  = require("../controllers/AuthController.js")

const router=express.Router()

router.post("/Signup",Signup)

router.post("/Signin",Signin)

router.post("/Google",GoogleLogin)

router.post("/logout",Logout)





module.exports = router;
