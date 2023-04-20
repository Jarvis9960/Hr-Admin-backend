const express = require("express");
const router = express.Router();
const {
  protectedRouteForEmployee,
  protectedRoute,
} = require("../middlewares/protectedMiddleware");
const {
  getNotificationByUser,
} = require("../controllers/notificationController");

router.get(
  "/getnotificationofemployee",
  protectedRouteForEmployee,
  getNotificationByUser
);

router.get("/getnotificationofadmin", protectedRoute, getNotificationByUser);

module.exports = router;
