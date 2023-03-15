const express = require("express");
const router = express.Router();
const {
  getEmployeeWorkingHourByEmail,
} = require("../controllers/workingHourController");
const {
  protectedRouteForEmployee,
} = require("../middlewares/protectedMiddleware");

router.get(
  "/getworkinghour/:Email",
  protectedRouteForEmployee,
  getEmployeeWorkingHourByEmail
);

module.exports = router;
