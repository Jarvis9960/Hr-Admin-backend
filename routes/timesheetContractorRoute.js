const express = require("express");
const router = express.Router();
const { addTimesheet, getTimesheet, getSortedData, editTimesheetDate, getTimesheetForContractor } = require("../controllers/timesheetContractorController");

router.post("/addtimesheet", addTimesheet);
router.get("/gettimesheet", getTimesheet);
router.get("/getsortedtimesheet", getSortedData);
router.patch("/edittimesheetdate", editTimesheetDate);
router.get("/gettimesheetforcontractor", getTimesheetForContractor)


module.exports = router;


