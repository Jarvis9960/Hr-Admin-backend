const express = require("express");
const router = express.Router();
const {
  protectedRouteForEmployee, protectedRoute
} = require("../middlewares/protectedMiddleware");
const {
  addemployeeProfileController,
  getCurrentEmployeeProfile,
  getAllEmployeeProfiles
} = require("../controllers/employeeProfileController");

router.post(
  "/addprofile",
  protectedRouteForEmployee,
  addemployeeProfileController
);
router.get("/getprofile", protectedRouteForEmployee, getCurrentEmployeeProfile);
router.get("/getallemployeeprofile", protectedRoute, getAllEmployeeProfiles);

module.exports = router;
