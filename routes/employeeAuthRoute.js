const express = require("express");
const router = express.Router();
const { loginControllerForEmployee, registerControllerForEmployee, forgotPasswordControllerForEmployee, resetPasswordControllerForEmployee } = require("../controllers/authController");

router.post("/loginforemployee", loginControllerForEmployee);
router.post("/registerforemployee", registerControllerForEmployee);


module.exports = router