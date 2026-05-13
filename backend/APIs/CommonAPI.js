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

