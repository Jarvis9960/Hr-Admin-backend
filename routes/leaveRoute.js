const express = require("express");
const router = express.Router();
const { leaveController, getAllEmployeeLeave, getEmployeeLeaveById } = require("../controllers/leaveController");
const { protectedRouteForEmployee } = require("../middlewares/protectedMiddleware")

router.post("/employeeleave", protectedRouteForEmployee, leaveController);
router.get("/getemployeeleave", protectedRouteForEmployee, getAllEmployeeLeave);
router.get("/currentuserleave", protectedRouteForEmployee, getEmployeeLeaveById);


module.exports = router;