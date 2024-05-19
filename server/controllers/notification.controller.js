import CatchResponse from "../lib/utils/catchResponse.js";
import Response from "../lib/utils/response.js";
import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  const userId = req.user._id;
  try {
    const notifications = await Notification.find({to: userId}).populate({
      path: "from",
      select: "username profileImg",
    });

    await Notification.updateMany({to: userId}, {read: true});

    return Response(res, {
      httpCode: 200,
      status: true,
      message: "Notifications Retrieved Successfully",
      data: notifications,
    });
  } catch (error) {
    console.log("Error from Notification Controller:", error);
    CatchResponse(res);
  }
};

export const deleteNotifications = async (req, res) => {
  const userId = req.user._id;
  try {
    await Notification.deleteMany({to: userId});

    return Response(res, {
      httpCode: 200,
      status: true,
      message: "Notifications deleted successfully",
    });
  } catch (error) {
    console.log("Error from Notifications Controller: ", error);
    CatchResponse(res);
  }
};

export const deleteNotificationById = async (req, res) => {
  const notificationId = req.params.id;
  const userId = req.user._id;
  try {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return Response(res, {
        httpCode: 404,
        status: false,
        message: "Notification not found",
      });
    }

    if (notification.to.toString() !== userId.toString()) {
      return Response(res, {
        httpCode: 403,
        status: false,
        message: "You are not allowed to delet this notification",
      });
    }

    await Notification.findByIdAndDelete(notificationId);

    return Response(res, {
      httpCode: 200,
      status: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.log("Error from Notifications Controller: ", error);
    CatchResponse(res);
  }
};
