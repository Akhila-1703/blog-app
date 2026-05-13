import exp from "express";
import { register } from "../services/authService.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { upload } from "../config/multer.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";

export const authorRoute = exp.Router();

//Register author(public)
authorRoute.post("/users", upload.single("profileImageUrl"), async (req, res, next) => {

  let cloudinaryResult;

  try {

    //get user obj
    let userObj = req.body;

    // upload image
    if (req.file) {
      cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    }

    // register user
    const newUserObj = await register({
      ...userObj,
      role: "AUTHOR",
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

//Create article
authorRoute.post("/articles", verifyToken("AUTHOR"), async (req, res, next) => {

  try {

    let article = {
      ...req.body,
      author: req.user._id
    };

    let newArticleDoc = new ArticleModel(article);

    let createdArticleDoc = await newArticleDoc.save();

    res.status(201).json({
      message: "article created",
      payload: createdArticleDoc
    });

  } catch (err) {
    next(err);
  }
});

//Read articles of author
authorRoute.get("/articles", verifyToken("AUTHOR"), async (req, res, next) => {

  try {

    let articles = await ArticleModel
      .find({ author: req.user._id })
      .populate(
        "author",
        "firstName lastName email profileImageUrl"
      );

    res.status(200).json({
      message: "articles",
      payload: articles
    });

  } catch (err) {
    next(err);
  }
});

//edit article
authorRoute.put("/articles", verifyToken("AUTHOR"), async (req, res, next) => {

  try {

    let author = req.user._id;

    let { articleId, title, category, content } = req.body;

    let articleOfDB = await ArticleModel.findOne({
      _id: articleId,
      author: author
    });

    if (!articleOfDB) {
      return res.status(404).json({
        message: "Article not found"
      });
    }

    let updatedArticle = await ArticleModel.findByIdAndUpdate(
      articleId,
      {
        $set: { title, category, content },
      },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      message: "article updated",
      payload: updatedArticle
    });

  } catch (err) {
    next(err);
  }
});

//soft delete article
authorRoute.patch("/articles/:id/status", verifyToken("AUTHOR"), async (req, res, next) => {

  try {

    const { id } = req.params;
    const { isArticleActive } = req.body;

    const article = await ArticleModel.findById(id);

    if (!article) {
      return res.status(404).json({
        message: "Article not found"
      });
    }

    // ownership check
    if (
      req.user.role === "AUTHOR" &&
      article.author.toString() !== req.user._id
    ) {
      return res.status(403).json({
        message: "Forbidden. You can only modify your own articles"
      });
    }

    // already same state
    if (article.isArticleActive === isArticleActive) {
      return res.status(400).json({
        message: `Article is already ${isArticleActive ? "active" : "deleted"}`
      });
    }

    article.isArticleActive = isArticleActive;

    await article.save();

    res.status(200).json({
      message: `Article ${isArticleActive ? "restored" : "deleted"} successfully`,
      payload: article
    });

  } catch (err) {
    next(err);
  }
});
