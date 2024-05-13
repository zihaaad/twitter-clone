import Response from "../lib/utils/response.js";
import User from "../models/user.model.js";

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
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
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
      await User.findByIdAndUpdate(id, {$pull: {followers: req.user._id}});
      await User.findByIdAndUpdate(req.user._id, {$pull: {followers: id}});
      Response(res, {
        httpCode: 200,
        success: true,
        message: "User unfollowed successfully",
      });
    } else {
      await User.findByIdAndUpdate(id, {$push: {followers: req.user._id}});
      await User.findByIdAndUpdate(req.user._id, {$push: {following: id}});
      Response(res, {
        httpCode: 200,
        success: true,
        message: "User followed successfully",
      });
    }
  } catch (error) {}
};

export default {getUserProfile, followUnfollowUser};
