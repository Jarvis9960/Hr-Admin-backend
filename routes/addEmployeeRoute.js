const express = require("express");
const { addEmployeeController, getEmployeeController, getEmployeeforContractor } = require("../controllers/employeeController");
const { protectedRoute } = require("../middlewares/protectedMiddleware");
const router = express.Router();

router.post("/addemployee", protectedRoute, addEmployeeController);
router.get("/getallemployees", protectedRoute, getEmployeeController);
router.get("/getallemployeesforcontrator", getEmployeeforContractor);

module.exports = router;
