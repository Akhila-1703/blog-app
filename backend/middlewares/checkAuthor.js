import { UserTypeModel } from "../models/UserModel.js";
import mongoose from "mongoose";

export const checkAuthor = async (req, res, next) => {
  try {
    const aid = req.body?.author || req.params.authorId;

    if (!aid || aid === "undefined") {
      return res.status(400).json({ message: "Author ID is required" });
    }

    const author = await UserTypeModel.findById(aid);

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    if (author.role !== "AUTHOR") {
      return res.status(403).json({ message: "User is not an author" });
    }

    if (!author.isActive) {
      return res.status(403).json({ message: "Author account is not active" });
    }

    next();
  } catch (err) {
    next(err);
  }
};

