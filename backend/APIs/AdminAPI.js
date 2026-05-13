import exp from 'express'
import { ArticleModel } from '../models/ArticleModel.js'
import { UserTypeModel } from '../models/UserModel.js';
import { verifyToken } from '../middlewares/verifyToken.js';

export const adminRoute = exp.Router()

//Read all articles
adminRoute.get(
  '/articles',
  verifyToken("ADMIN"),
  async (req, res, next) => {

    try {

      const articles = await ArticleModel.find();

      res.status(200).json({
        message: "All articles fetched",
        payload: articles
      });

    } catch (err) {
      next(err);
    }
  }
);

//block user
adminRoute.put('/block-user', verifyToken("ADMIN"), async (req, res, next) => {

  try {

      let { userId } = req.body;
      
      if (req.user._id === userId) {
  return res.status(400).json({
    message: "Admin cannot block own account"
  });
      }
      

    if (!userId) {
      return res.status(400).json({
        message: "UserId not found"
      });
    }

    let blockedUser = await UserTypeModel.findOne({
      _id: userId,
      isActive: true
    });

    if (!blockedUser) {
      return res.status(404).json({
  message: "User not found or already blocked"
      });
    }

    await UserTypeModel.findByIdAndUpdate(userId, {
      $set: { isActive: false }
    });

    return res.status(200).json({
      message: "User is blocked"
    });

  } catch (err) {
    next(err);
  }
});

//unblock user
adminRoute.put('/unblock-user', verifyToken("ADMIN"), async (req, res, next) => {

  try {

    let { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "UserId not found"
      });
    }

    let blockedUser = await UserTypeModel.findOne({
      _id: userId,
      isActive: false
    });

    if (!blockedUser) {
      return res.status(404).json({
  message: "User not found or already active"
      });
    }

    await UserTypeModel.findByIdAndUpdate(userId, {
      $set: { isActive: true }
    });

    return res.status(200).json({
      message: "User is unblocked"
    });

  } catch (err) {
    next(err);
  }
});

/*import exp from 'express'
import { ArticleModel } from '../models/ArticleModel.js'
import { UserTypeModel } from '../models/UserModel.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { authenticate } from '../services/authService.js';
export const adminRoute=exp.Router()


//Read all articles
adminRoute.get('/articles', async (req, res) => {
    const articles = await ArticleModel.find();
    res.status(200).json({ message: "All articles fetched", payload: articles });
});


//block 
adminRoute.put('/block-user',verifyToken("ADMIN"),async(req,res)=>{
    let {userId}=req.body
    let BlockedUser=await UserTypeModel.findOne({
    _id:userId,
    isActive:true
    })
    if(!BlockedUser){
    return res.json({message:"User not found or already blocked"})
}
    if(!userId){
        return res.status(200).json({message:"UserId not found"})
    }
    await UserTypeModel.findByIdAndUpdate(userId,{
        $set:{isActive:false}
    })
    return res.json({message:"User is blocked"})
})

//unblock user role
adminRoute.put('/unblock-user',verifyToken("ADMIN"),async(req,res)=>{
let {userId}=req.body
let BlockedUser=await UserTypeModel.findOne({
    _id:userId,
    isActive:false
})
    if(!BlockedUser){
    return res.json({message:"User not found or already active"})
}
if(!userId){
    return res.status(200).json({message:"UserId not found"})
    }
await UserTypeModel.findByIdAndUpdate(userId,{
    $set:{isActive:true}
})
return res.json({message:"User is unblocked"})
})

import exp from 'express'
import { UserTypeModel } from '../models/UserModel.js'
import { ArticleModel } from '../models/ArticleModel.js'
export const adminRoute = exp.Router()


//read all articles
adminRoute.get('/articles', async (req, res) => {
    //get all articles from database
    let articles = await ArticleModel.find({ isArticleActive: true })
    //send articles in res
    res.json({ message: "all articles", payload: articles })
})


//block user by id
adminRoute.put('/block/:id', async (req, res) => {
    //read user id from url
    let uid = req.params.id
    //find user in database
    let user = await UserTypeModel.findById(uid)
    //if user not found, send response
    if (!user) {
        return res.json({message:"User not found"})
    }
    //check if user is already blocked
    if (user.isActive==false) {
        return res.json({message:"User already blocked previously"})
    }
    //update user status to blocked
    let blockUser = await UserTypeModel.findByIdAndUpdate(uid, { $set: { isActive: false } })
    //send confirmation res
    res.json({message:"User blocked"})
})


//unblock user by id
adminRoute.put('/unblock/:id', async (req, res) => {
    //read user id from url
    let uid = req.params.id
    //find user in database
    let user = await UserTypeModel.findById(uid)
    //if user not found, send response
    if (!user) {
        return res.json({message:"User not found"})
    }
    //check if user is already unblocked
    if (user.isActive==true) {
        return res.json({message:"User already unblocked previously"})
    }
    //update user status to active
    let blockUser = await UserTypeModel.findByIdAndUpdate(uid, { $set: { isActive: true } })
    //send confirmation res
    res.json({message:"User unblocked"})
})*/