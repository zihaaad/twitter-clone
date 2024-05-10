import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import generateTokenAndSetCookie from "../lib/utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const {fullName, username, email, password} = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      return res
        .status(400)
        .json({success: false, message: "Invalid email format"});
    }

    const existingUser = await User.findOne({username});
    if (existingUser) {
      return res
        .status(400)
        .json({success: false, message: "Username is already taken"});
    }

    const existingEmail = await User.findOne({email});
    if (existingEmail) {
      return res
        .status(400)
        .json({success: false, message: "Email already exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newUser,
      });
    } else {
      res.status(400).json({success: false, message: "Invalid user data"});
    }
  } catch (error) {
    console.log("Error", error.message);
    res.status(500).json({success: false, message: "Invalid user data"});
  }
};

export const login = async (req, res) => {
  res.json({
    message: "Login",
  });
};

export const logout = async (req, res) => {
  res.json({
    message: "Logout",
  });
};
