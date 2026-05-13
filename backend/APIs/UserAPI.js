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

//Read article by ID
userRoute.get("/article/:id", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await ArticleModel.findOne({ _id: id, isArticleActive: true })
      .populate("author", "firstName lastName email profileImageUrl")
      .populate("comments.user", "firstName lastName profileImageUrl");

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({
      message: "article found",
      payload: article
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