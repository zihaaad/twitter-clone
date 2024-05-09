import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./database/db.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// routes middleware
app.use("/api/auth", authRoutes);

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
