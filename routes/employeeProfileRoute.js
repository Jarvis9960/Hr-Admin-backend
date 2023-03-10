const express = require("express");
const router = express.Router();
const {
  protectedRouteForEmployee,
} = require("../middlewares/protectedMiddleware");
const {
  addemployeeProfileController,
  getCurrentEmployeeProfile,
} = require("../controllers/employeeProfileController");

router.post(
  "/addprofile",
  protectedRouteForEmployee,
  addemployeeProfileController
);
router.get("/getprofile", protectedRouteForEmployee, getCurrentEmployeeProfile);

module.exports = router;
