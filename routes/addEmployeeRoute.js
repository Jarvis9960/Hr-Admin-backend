const express = require("express");
const { addEmployeeController, getEmployeeController } = require("../controllers/employeeController");
const { protectedRoute } = require("../middlewares/protectedMiddleware");
const router = express.Router();

router.post("/addemployee", protectedRoute, addEmployeeController);
router.get("/getallemployees", protectedRoute, getEmployeeController);

module.exports = router;
