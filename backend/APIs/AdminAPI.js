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


adminRoute.put(
  "/article-status",
  verifyToken("ADMIN"),
  async (req, res, next) => {

    try {

      const { articleId, isArticleActive } = req.body;

      const updatedArticle =
        await ArticleModel.findByIdAndUpdate(
          articleId,
          {
            $set: { isArticleActive }
          },
          { new: true }
        );

      res.status(200).json({
        message: isArticleActive
          ? "Article restored"
          : "Article deleted",
        payload: updatedArticle
      });

    } catch (err) {
      next(err);
    }
  }
);


adminRoute.get(
  "/stats",
  verifyToken("ADMIN"),
  async (req, res, next) => {

    try {

      const totalUsers =
        await UserTypeModel.countDocuments({
          role: "USER"
        });

      const totalAuthors =
        await UserTypeModel.countDocuments({
          role: "AUTHOR"
        });

      const totalArticles =
        await ArticleModel.countDocuments();

      const activeArticles =
        await ArticleModel.countDocuments({
          isArticleActive: true
        });

      res.status(200).json({
        payload: {
          totalUsers,
          totalAuthors,
          totalArticles,
          activeArticles
        }
      });

    } catch (err) {
      next(err);
    }
  }
);

// =====================================================
// GET ALL USERS
// =====================================================

adminRoute.get(
  "/users",
  verifyToken("ADMIN"),
  async (req, res, next) => {

    try {

      const users = await UserTypeModel
        .find()
        .select("-password");

      res.status(200).json({
        message: "Users fetched successfully",
        payload: users
      });

    } catch (err) {
      next(err);
    }
  }
);


// =====================================================
// ADMIN STATS
// =====================================================

