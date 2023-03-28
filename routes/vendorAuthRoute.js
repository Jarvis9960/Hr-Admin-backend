const express = require("express");
const router = express.Router();
const { loginControllerForVendor, registerControllerForVendor   } = require("../controllers/authController");

router.post("/loginforvendor", loginControllerForContractor);
router.post("/registerforvendor", registerControllerForContractor);


module.exports = router