const express = require("express");
const router = express.Router();
const { addTimesheet } = require("../controllers/timesheetContractorController");

router.post("/addtimesheet", addTimesheet);


module.exports = router;


