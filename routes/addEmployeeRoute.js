const express = require("express");
const { addEmployeeController, getEmployeeController, getEmployeeController } = require("../controllers/employeeController");
const { protectedRoute } = require("../middlewares/protectedMiddleware");
const router = express.Router();

router.post("/addemployee", protectedRoute, addEmployeeController);
router.get("/getallemployees", protectedRoute, getEmployeeController);
router.get("/getallemployeesforcontrator", getEmployeeController);

module.exports = router;
