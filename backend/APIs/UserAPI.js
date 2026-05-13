import exp from "express";
import { register } from "../services/authService.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { upload } from "../config/multer.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";

export const userRoute = exp.Router();

//Register user
userRoute.post("/users", upload.single("profileImageUrl"), async (req, res, next) => {

  let cloudinaryResult;

  try {

    let userObj = req.body;

    // upload image
    if (req.file) {
      cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    }

    // register user
    const newUserObj = await register({
      ...userObj,
      role: "USER",
      profileImageUrl: cloudinaryResult?.secure_url,
    });

    res.status(201).json({
      message: "user created",
      payload: newUserObj,
    });

  } catch (err) {

    // rollback uploaded image
    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    }

    next(err);
  }
});

//Read all articles
userRoute.get("/articles", verifyToken("USER"), async (req, res, next) => {

  try {

    const articles = await ArticleModel
      .find({ isArticleActive: true })
      .populate("author", "firstName lastName email profileImageUrl");

    res.status(200).json({
      message: "all articles",
      payload: articles
    });

  } catch (err) {
    next(err);
  }
});

//Add comment
userRoute.put("/articles", verifyToken("USER"), async (req, res, next) => {

  try {

    const { articleId, comment } = req.body;

    // empty comment validation
    if (!comment || !comment.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty"
      });
    }

    // logged in user id
    const userId = req.user._id;

    // add comment
    const articleWithComment = await ArticleModel.findOneAndUpdate(
      {
        _id: articleId,
        isArticleActive: true
      },
      {
        $push: {
          comments: {
            user: userId,
            comment
          }
        }
      },
      {
        new: true,
        runValidators: true
      }
    ).populate("comments.user", "firstName lastName");

    if (!articleWithComment) {
      return res.status(404).json({
        message: "Article not found or inactive"
      });
    }

    res.status(200).json({
      message: "Comment added successfully",
      payload: articleWithComment,
    });

  } catch (err) {
    next(err);
  }
});

/*import exp from 'express'
import { register,authenticate } from '../services/authService.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { ArticleModel } from '../models/ArticleModel.js'
import { upload } from '../config/multer.js'
import cloudinary from '../config/cloudinary.js'
import { uploadToCloudinary } from '../config/cloudinaryUpload.js'

export const userRoute = exp.Router()

//register user
userRoute.post(
        "/users",
        upload.single("profileImageUrl"),
        async (req, res, next) => {
        let cloudinaryResult;

            try {
                let userObj = req.body;

                //  Step 1: upload image to cloudinary from memoryStorage (if exists)
                if (req.file) {
                cloudinaryResult = await uploadToCloudinary(req.file.buffer);
                }

                // Step 2: call existing register()
                const newUserObj = await register({
                ...userObj,
                role: "USER",
                profileImageUrl: cloudinaryResult?.secure_url,
                });

                res.status(201).json({
                message: "user created",
                payload: newUserObj,
                });

            } catch (err) {

                // Step 3: rollback 
                if (cloudinaryResult?.public_id) {
                await cloudinary.uploader.destroy(cloudinaryResult.public_id);
                }

                next(err); // send to your error middleware
            }

        }
);


// read all articles (protected)
userRoute.get("/articles", verifyToken("USER"), async (req, res) => {
    // get all active articles
    const articles = await ArticleModel.find({ isArticleActive: true })
    // send res
    res.status(200).json({ message: "Articles fetched", payload: articles })
})

// read single article by id (public) - for displaying full article with comments
userRoute.get("/article/:id", async (req, res) => {
    try {
        const article = await ArticleModel.findById(req.params.id)
            .populate("author", "firstName email")
            .populate("comments.user", "email");
        
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }
        
        res.status(200).json({ message: "Article fetched", payload: article });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch article" });
    }
})

// add comment to an article (protected)
userRoute.put('/articles', verifyToken("USER"), async (req, res) => {
    // get comment obj from req
    const { user, articleId, comment } = req.body
    //check user(req.user)
    if (user!==req.user.userId) {
        return res.status(403).json({message:"Forbidden"})
    }
    //find article by id and update
    let articleWithComment = await ArticleModel.findOneAndUpdate(
        { _id: articleId, isArticleActive: true },
        { $push: { comments: { user, comment } } },
        { new: true, runValidators: true })
        .populate("author", "firstName email")
        .populate("comments.user", "email");
    //if article not found
    if (!articleWithComment) {
        return res.status(404).json({ message: "Article not found" })
    }
    //send res
    res.status(201).json({ message: "Comment added successfully", payload: articleWithComment })
})*/