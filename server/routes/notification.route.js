import express from "express";
import {auth} from "../middleware/auth.js";
import {
  deleteNotificationById,
  deleteNotifications,
  getNotifications,
} from "../controllers/notification.controller.js";
const notificationRoutes = express.Router();

notificationRoutes.get("/", auth, getNotifications);
notificationRoutes.delete("/", auth, deleteNotifications);
notificationRoutes.delete("/:id", auth, deleteNotificationById);

export default notificationRoutes;
