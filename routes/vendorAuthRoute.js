const express = require("express");
const router = express.Router();
const { loginControllerForVendor, registerControllerForVendor   } = require("../controllers/authController");

router.post("/loginforvendor", loginControllerForVendor);
router.post("/registerforvendor", registerControllerForVendor);


module.exports = router