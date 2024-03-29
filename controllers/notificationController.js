const notification = require("../models/notficationSchema");

const getNotificationByUser = async (req, res) => {
  try {
    const { userEmail } = req.query;
   
    if (!userEmail) {
      return res
        .status(422)
        .json({ status: false, message: "user is not given to query" });
    }

    const savedNotificationOfUser = await notification.find({
      UserEmail: userEmail,
    });

    if (savedNotificationOfUser.length < 1) {
      return res.status(501).json({
        status: false,
        message: "there no notificaiton for current user",
      });
    }

    if (!savedNotificationOfUser) {
      return res.status(422).json({
        status: false,
        message: "something went wrong with notification",
      });
    }

    return res.status(201).json({
      status: true,
      message: "successfully fetched notfication for user",
      savedNotificationOfUser,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { notificationID } = req.query;

    if (!notificationID) {
      return res
        .status(422)
        .json({ status: false, message: "notification id is not given" });
    }

    const deletedNotificationResponse = await notification.deleteOne({
      _id: notificationID,
    });

    if (deletedNotificationResponse.acknowledged) {
      return res
        .status(201)
        .json({ status: true, message: "notification removed" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};


module.exports = { getNotificationByUser, deleteNotification } ;
