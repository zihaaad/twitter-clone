import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./database/db.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send({
    success: true,
    server: "active",
  });
});

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON http://localhost:${PORT}`);
  connectDatabase();
});
