const express = require("express");
const router = express.Router();
const {
  getEmployeeWorkingHourByEmail, getAllEmployeeWorkingHour
} = require("../controllers/workingHourController");
const {
  protectedRouteForEmployee, protectedRoute
} = require("../middlewares/protectedMiddleware");

router.get(
  "/getworkinghour/:Email",
  protectedRouteForEmployee,
  getEmployeeWorkingHourByEmail
);

router.get("/allemployeeworkinghour", protectedRoute, getAllEmployeeWorkingHour)

module.exports = router;
