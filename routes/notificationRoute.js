const express = require("express");
const router = express.Router();
const {
  protectedRouteForEmployee,
  protectedRoute,
  protectedRouteForContractor,
} = require("../middlewares/protectedMiddleware");
const {
  getNotificationByUser,
  deleteNotification,
} = require("../controllers/notificationController");

router.get(
  "/getnotificationofemployee",
  protectedRouteForEmployee,
  getNotificationByUser
);

router.get("/getnotificationofadmin", protectedRoute, getNotificationByUser);

router.delete("/deletenotificationforadmin", protectedRoute, deleteNotification);
router.delete(
  "/deletenotificationforemployee",
  protectedRouteForEmployee,
  deleteNotification
);
router.delete(
  "/deletenotificationforcontractor",
  protectedRouteForContractor,
  deleteNotification
);

module.exports = router;
