const express = require("express");
const router = express.Router();
const { leaveController, getAllEmployeeLeave, getEmployeeLeaveById, updateEmployeeLeaveStatus } = require("../controllers/leaveController");
const { protectedRouteForEmployee, protectedRoute } = require("../middlewares/protectedMiddleware")

router.post("/employeeleave", protectedRouteForEmployee, leaveController);
router.get("/getemployeeleave", protectedRoute, getAllEmployeeLeave);
router.get("/currentuserleave", protectedRouteForEmployee, getEmployeeLeaveById);
router.patch("/updateleavestatus", protectedRoute, updateEmployeeLeaveStatus);


module.exports = router;
