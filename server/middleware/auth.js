import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized: No Token Provided",
          data: null,
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      res
        .status(401)
        .json({success: false, message: "Unauthorized: Invalid Token"});
    }

    const user = await User.findById(decoded.userId).select("-password");

    req.user = user;
    next();
  } catch (error) {
    console.log("Error In auth middleware:", error.message);
    res.status(500).json({success: false, message: "Internal Server Error"});
  }
};
