const express = require("express");
const router = express.Router();
const { loginController, registerController, forgotPasswordController, resetPasswordController } = require("../controllers/authController");

router.post("/login", loginController);
router.post("/register", registerController);
router.patch("/forgotpassword", forgotPasswordController);
router.patch("/resetpassword", resetPasswordController)

module.exports = router;
