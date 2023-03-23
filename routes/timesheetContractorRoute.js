const express = require("express");
const router = express.Router();
const { addTimesheet, getTimesheet, getSortedData, editTimesheetDate } = require("../controllers/timesheetContractorController");

router.post("/addtimesheet", addTimesheet);
router.get("/gettimesheet", getTimesheet);
router.get("/getsortedtimesheet", getSortedData);
router.patch("/edittimesheetdate", editTimesheetDate);


module.exports = router;


