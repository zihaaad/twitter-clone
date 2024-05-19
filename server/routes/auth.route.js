import express from "express";
import {login, signup, logout, getMe} from "../controllers/auth.controller.js";
import {auth} from "../middleware/auth.js";

const authRoutes = express.Router();

authRoutes.get("/me", auth, getMe);
authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);

export default authRoutes;
