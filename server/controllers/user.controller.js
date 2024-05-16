import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import {v2 as cloudinary} from "cloudinary";
import Response from "../lib/utils/response.js";
import bcrypt from "bcrypt";
import CatchResponse from "../lib/utils/catchResponse.js";

export const getUserProfile = async (req, res) => {
  const {username} = req.params;

  try {
    const user = await User.findOne({username}).select("-password");

    if (!user) {
      Response(res, {
        httpCode: 404,
        status: false,
        message: "User not found!",
      });
    }

    Response(res, {
      httpCode: 200,
      status: true,
      message: "User profile data retrived successfully",
      data: user,
    });
  } catch (error) {
    console.log("Error", error.message);
    Response(res, {
      httpCode: 500,
      status: false,
      message: "Internal Server Error",
    });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const {id} = req.params;
    const _id = req.user._id.toString();
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(_id);

    if (id === _id) {
      return Response(res, {
        httpCode: 400,
        status: false,
        message: "You can't follow/unfollow yourself",
      });
    }

    if (!userToModify || !currentUser) {
      return Response(res, {
        httpCode: 400,
        status: false,
        message: "User not found",
      });
    }

    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      await User.findByIdAndUpdate(id, {$pull: {followers: _id}});
      await User.findByIdAndUpdate(_id, {$pull: {following: id}});
      Response(res, {
        httpCode: 200,
        status: true,
        message: "User unfollowed successfully",
      });
    } else {
      await User.findByIdAndUpdate(id, {$push: {followers: _id}});
      await User.findByIdAndUpdate(_id, {$push: {following: id}});
      const newNotification = new Notification({
        type: "follow",
        from: _id,
        to: userToModify._id,
      });
      await newNotification.save();

      Response(res, {
        httpCode: 200,
        status: true,
        message: "User followed successfully",
      });
    }
  } catch (error) {
    console.log("Error from User Controller", error);
    CatchResponse(res);
  }
};

export const getSuggestedUsers = async (req, res) => {
  const userId = req.user._id;
  try {
    const usersFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: {$ne: userId},
        },
      },
      {$sample: {size: 10}},
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));

    Response(res, {
      httpCode: 200,
      status: true,
      message: "Suggested users retrived successfully",
      data: suggestedUsers,
    });
  } catch (error) {
    console.log("Error from User Controller", error);
    CatchResponse(res);
  }
};

export const updateUser = async (req, res) => {
  const {fullName, email, username, currentPassword, newPassword, bio, link} =
    req.body;
  let {profileImg, coverImage} = req.body;
  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) {
      return Response(res, {
        httpCode: 400,
        status: false,
        message: "User not found",
      });
    }

    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return Response(res, {
        httpCode: 400,
        status: false,
        message: "Please provide both current & new password",
      });
    }

    if (currentPassword && newPassword) {
      const isMatchPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isMatchPassword) {
        return Response(res, {
          httpCode: 400,
          status: false,
          message: "Current password is incorrect",
        });
      }
      if (newPassword.length < 8) {
        return Response(res, {
          httpCode: 400,
          status: false,
          message: "Password must be at least 8 characters long",
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    console.log(username);

    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(user.profileImg);
      }
      const uploadedRes = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedRes.secure_url;
    }

    if (coverImage) {
      // .split("/").pop().split(".")[0]
      if (user.coverImage) {
        await cloudinary.uploader.destroy(user.coverImage);
      }
      const uploadedRes = await cloudinary.uploader.upload(coverImage);
      coverImage = uploadedRes.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImage = coverImage || user.coverImage;

    user = await user.save();
    user.password = null;
    console.log(user);

    return Response(res, {
      httpCode: 200,
      status: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.log("Error from User Controller", error);
    CatchResponse(res);
  }
};
