import exp from 'express'
import { authenticate } from '../services/authService.js'
import { hash, compare } from 'bcryptjs'
import { UserTypeModel } from '../models/UserModel.js'
import { verifyToken } from '../middlewares/verifyToken.js'

export const commonRouter = exp.Router()

//login
commonRouter.post("/login", async (req, res, next) => {

  try {

    //get user cred obj
    let userCred = req.body

    //call authenticate
    let { token, user } = await authenticate(userCred)

    //save token
    res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production"
    ? "none"
    : "lax"
    });
    

    res.status(200).json({
      message: "Login Success",
      payload: user
    });

  } catch (err) {
    next(err);
  }
})

//logout
commonRouter.get('/logout', async (req, res, next) => {

  try {

    //clear the cookie named token
    res.clearCookie("token", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production"
    ? "none"
    : "lax"
    })
    

    res.status(200).json({
      message: "Logout successful"
    })

  } catch (err) {
    next(err);
  }
})

//change password
commonRouter.put(
  '/change-password',
  verifyToken("USER", "AUTHOR", "ADMIN"),
  async (req, res, next) => {

    try {

      //get current password and new password
      let { currentPassword, newPassword } = req.body

      let user = await UserTypeModel.findOne({
        email: req.user.email
      })

      if (!user) {
        return res.status(404).json({
          message: "User not found"
        })
      }

      //check current password
      let isMatch = await compare(currentPassword, user.password)

      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid old password"
        })
      }

      //hash new password
      const hashedPassword = await hash(newPassword, 12)

      //update password
      user.password = hashedPassword

      await user.save()

      //remove password before sending
      let userObj = user.toObject()

      delete userObj.password

      //send res
      res.json({
        message: "Password changed successfully",
        payload: userObj
      })

    } catch (err) {
      next(err);
    }
  }
)

//Page Refresh
commonRouter.get(
  "/check-auth",
  verifyToken("USER", "AUTHOR", "ADMIN"),
  (req, res) => {

    res.status(200).json({
      message: "authenticated",
      payload: req.user
    })
  }
)

/*import exp from 'express'
import { authenticate } from '../services/authService.js'
import {hash,compare} from 'bcryptjs'
import { UserTypeModel } from '../models/UserModel.js'
import { verifyToken } from '../middlewares/verifyToken.js'
export const commonRouter=exp.Router()


//login
commonRouter.post("/login",async(req,res)=>{
    //get user cred obj
    let userCred=req.body
    //call authenticate
    let {token,user}= await authenticate(userCred)
    //save token
    res.cookie("token",token,{
        httpOnly:true,
        sameSite:"lax",
        secure:false
    });
    res.status(200).json({message:"Login Success",payload:user})

})

//logout
commonRouter.get('/logout',async(req,res)=>{
     //clear the cookie named token
  res.clearCookie('token',{
    httpOnly:true,
    secure:false,
    sameSite:"lax"
  })
  res.status(200).json({message:"Logout sucesssfull"})
})


//change password
commonRouter.put('/change-password',verifyToken("USER","AUTHOR","ADMIN"),async(req,res)=>{
  //get current password and new password
  let {currentPassword,newPassword}=req.body
  let user=await UserTypeModel.findOne({email:req.user.email})
  if(!user){
  return res.json({message:"user not found"})
  }
  //check the current password is correct
  let isMatch=await compare(currentPassword,user.password)
  if(!isMatch){
   return res.json({message:"Invalid Old password"})
  }
  //replace  current password with new password
  // hash new password
  const hashedPassword = await hash(newPassword, 12)
  // update password
  user.password = hashedPassword
  await user.save()
  //send res
  let userObj=user.toObject()
  delete userObj.password
  res.json({message:"Password changed successfully",payload:userObj})
})

//Page Refresh 
commonRouter.get("/check-auth",verifyToken("USER","AUTHOR","ADMIN"),(req,res)=>{
  res.status(200).json({
    message:"authenticated",
    payload:req.user
  })
})

import exp from "express";
import { authenticate } from "../services/authService.js";
import { UserTypeModel } from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { verifyToken } from "../middlewares/verifyToken.js";
export const commonRouter = exp.Router();

//login
commonRouter.post("/login", async (req, res) => {
  //get user cred object
  let userCred = req.body;
  //call authenticate service
  let { token, user } = await authenticate(userCred);
  //save tokan as httpOnly cookie
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });
  //send res
  res.status(200).json({ message: "login success", payload: user });
});

//logout for User, Author and Admin
commonRouter.get("/logout", (req, res) => {
  // Clear the cookie named 'token'
  res.clearCookie("token", {
    httpOnly: true, // Must match original  settings
    secure: false, // Must match original  settings
    sameSite: "lax", // Must match original  settings
  });

  res.status(200).json({ message: "Logged out successfully" });
});

//Change password(Protected route)
commonRouter.put("/change-password", async (req, res) => {
  //get current password and new password
  const { role, email, currentPassword, newPassword } = req.body;
  // Prevent same password
  if (currentPassword === newPassword) {
    return res.status(400).json({ message: "newPassword must be different from currentPassword" });
  }

  // Find user by email (works for USER, AUTHOR, ADMIN — all same collection)
  const account = await UserTypeModel.findOne({ email });
  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  // Verify current password
  const isMatch = await bcrypt.compare(currentPassword, account.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }
  // Hash and save new password
  account.password = await bcrypt.hash(newPassword, 10);
  await account.save();

  res.status(200).json({ message: "Password changed successfully" });
});

//Page refresh


commonRouter.get("/check-auth", async (req, res) => {
  try {
    const token = req.cookies.token;

    // no token
    if (!token) {
      return res.status(200).json({
        authenticated: false,
        payload: null,
      });
    }

    // verify token
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(200).json({
          authenticated: false,
          payload: null,
        });
      }

      return res.status(200).json({
        authenticated: true,
        payload: decoded,
      });
    });
  } catch (err) {
    res.status(500).json({
      error: "Authentication check failed",
    });
  }
});*/