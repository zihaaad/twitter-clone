import Response from "../lib/utils/response.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import {v2 as cloudinary} from "cloudinary";

export const createPost = async (req, res) => {
  const {text} = req.body;
  const {img} = req.body;
  const userId = req.user._id.toString();

  try {
    const user = await User.findById(userId);
    if (!user) {
      return Response(res, {
        httpCode: 400,
        status: false,
        message: "User not found",
      });
    }

    if (!text && !img) {
      return Response(res, {
        httpCode: 400,
        status: false,
        message: "Post must have text or image",
      });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();
    return Response(res, {
      httpCode: 201,
      status: true,
      message: "Post Created Successfully",
      data: newPost,
    });
  } catch (error) {
    console.log("Error In Post Controller:", error);
    return Response(res, {
      httpCode: 500,
      status: false,
      message: "Internal Server Error",
    });
  }
};

export const deletePost = async (req, res) => {
  const {id} = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return Response(res, {
        httpCode: 400,
        status: false,
        message: "Post not found!",
      });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return Response(res, {
        httpCode: 401,
        status: false,
        message: "You are not authorized to delete this post",
      });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    await Post.findByIdAndDelete(id);
    return Response(res, {
      httpCode: 200,
      status: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log("Error In Post Controller:", error);
    return Response(res, {
      httpCode: 500,
      status: false,
      message: "Internal Server Error",
    });
  }
};

export default {createPost, deletePost};
