const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    UserEmail: {
      type: String,
      required: true,
    },
    NotificationMessage: {
      type: String,
      required: true,
    },
    Sent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const notification = mongoose.model("notification", notificationSchema);

module.exports = notification;
