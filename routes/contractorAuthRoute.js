const express = require("express");
const router = express.Router();
const { loginControllerForContractor, registerControllerForContractor  } = require("../controllers/authController");

router.post("/loginforcontractor", loginControllerForContractor);
router.post("/registerforcontractor", registerControllerForContractor);


module.exports = router
