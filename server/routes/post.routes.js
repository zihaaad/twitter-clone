import express from "express";
import {auth} from "../middleware/auth.js";
import {
  commentOnPost,
  createPost,
  deletePost,
  getAllPosts,
  likeUnlikePost,
} from "../controllers/post.controller.js";

const postRoutes = express.Router();

postRoutes.get("/", auth, getAllPosts);
postRoutes.post("/create", auth, createPost);
postRoutes.post("/like/:id", auth, likeUnlikePost);
postRoutes.post("/comment/:id", auth, commentOnPost);
postRoutes.delete("/delete/:id", auth, deletePost);

export default postRoutes;
