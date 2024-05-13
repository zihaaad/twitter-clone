import express from "express";
import {auth} from "../middleware/auth.js";
import {
  getUserProfile,
  followUnfollowUser,
} from "../controllers/user.controller.js";

const userRoutes = express.Router();

userRoutes.get("/profile/:username", auth, getUserProfile);
// userRoutes.get("/suggested", auth, suggestedUsers);
userRoutes.post("/follow/:id", auth, followUnfollowUser);
// userRoutes.post("/update", auth, updateUserProfile);

export default userRoutes;
