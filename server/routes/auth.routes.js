import express from "express";
import {login, signup, logout} from "../controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);

export default authRoutes;
