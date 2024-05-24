import Response from "../lib/utils/response.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import {v2 as cloudinary} from "cloudinary";
import CatchResponse from "../lib/utils/catchResponse.js";

export const createPost = async (req, res) => {
  const {text} = req.body;
  let {img} = req.body;
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
    return CatchResponse(res);
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
    return CatchResponse(res);
  }
};

export const commentOnPost = async (req, res) => {
  const {text} = req.body;
  const postId = req.params.id;
  const userId = req.user._id;

  try {
    if (!text) {
      return Response(res, {
        httpCode: 400,
        status: false,
        message: "Text field is required",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return Response(res, {
        httpCode: 400,
        status: false,
        message: "Post not found",
      });
    }

    const comment = {user: userId, text};

    post.comments.push(comment);
    await post.save();

    return Response(res, {
      httpCode: 200,
      status: true,
      message: "Comment created successfully",
      data: post,
    });
  } catch (error) {
    console.log("Error from Post Controller:", error);
    return CatchResponse(res);
  }
};

export const likeUnlikePost = async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return Response(res, {
        httpCode: 400,
        status: false,
        message: "User not found",
      });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return Response(res, {
        httpCode: 400,
        status: false,
        message: "Post not found",
      });
    }

    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      await Post.updateOne({_id: postId}, {$pull: {likes: userId}});
      await User.updateOne({_id: userId}, {$pull: {likedPosts: postId}});

      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );

      return Response(res, {
        httpCode: 200,
        status: true,
        message: "Post unliked successfully",
        data: updatedLikes,
      });
    } else {
      post.likes.push(userId);
      await User.updateOne({_id: userId}, {$push: {likedPosts: postId}});
      await post.save();

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });

      await notification.save();
      const updatedLikes = post.likes;

      return Response(res, {
        httpCode: 200,
        status: true,
        message: "Post liked successfully",
        data: updatedLikes,
      });
    }
  } catch (error) {
    console.log("Error from Post Controller:", error);
    return CatchResponse(res);
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({createdAt: -1})
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    return Response(res, {
      httpCode: 200,
      status: true,
      message: "Posts retrieved successfully",
      data: posts,
    });
  } catch (error) {
    console.log("Error from Post Controller:", error);
    return CatchResponse(res);
  }
};

export const getLikedPosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return Response(res, {
        httpCode: 400,
        status: false,
        message: "User not found",
      });
    }

    const likedPosts = await Post.find({_id: {$in: user.likedPosts}})
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    Response(res, {
      httpCode: 200,
      status: true,
      message: "Liked posts retrieved successfully",
      data: likedPosts,
    });
  } catch (error) {
    console.log("Error from Post Controller:", error);
    return CatchResponse(res);
  }
};

export const getFollowingPosts = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return Response(res, {
        httpCode: 400,
        status: false,
        message: "User not found",
      });
    }

    const following = user.following;
    const feedPosts = await Post.find({user: {$in: following}})
      .sort({createdAt: -1})
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    Response(res, {
      httpCode: 200,
      status: true,
      message: "Feed Posts retrieved successfully",
      data: feedPosts,
    });
  } catch (error) {
    console.log("Error from Post Controller:", error);
    return CatchResponse(res);
  }
};

export const getUserPost = async (req, res) => {
  const {username} = req.params;
  try {
    const user = await User.findOne({username: username});
    if (!user) {
      return Response(res, {
        httpCode: 400,
        status: false,
        message: "User not found",
      });
    }

    const userPosts = await Post.find({user: user._id})
      .sort({createdAt: -1})
      .populate({
        path: "user",
        select: "-password",
      });

    Response(res, {
      httpCode: 200,
      status: true,
      message: "User Posts retrieved successfully",
      data: userPosts,
    });
  } catch (error) {
    console.log("Error from Post Controller:", error);
    return CatchResponse(res);
  }
};

export default {
  createPost,
  deletePost,
  commentOnPost,
  likeUnlikePost,
  getAllPosts,
  getLikedPosts,
};
