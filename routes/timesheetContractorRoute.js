const express = require("express");
const router = express.Router();
const { addTimesheet, getTimesheet, getSortedData } = require("../controllers/timesheetContractorController");

router.post("/addtimesheet", addTimesheet);
router.get("/gettimesheet", getTimesheet);
router.get("/getsortedtimesheet", getSortedData)


module.exports = router;


