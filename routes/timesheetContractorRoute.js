const express = require("express");
const router = express.Router();
const { addTimesheet, getTimesheet, getSortedData, editTimesheetDateForAdmin, getTimesheetForContractor, editTimesheetDateForContractor, approveTimesheetFromAdmin } = require("../controllers/timesheetContractorController");

router.post("/addtimesheet", addTimesheet);
router.get("/gettimesheet", getTimesheet);
router.get("/getsortedtimesheet", getSortedData);
router.patch("/edittimesheetdateforadmin", editTimesheetDateForAdmin);
router.get("/gettimesheetforcontractor", getTimesheetForContractor);
router.patch("/edittimesheetdateforcontractor", editTimesheetDateForContractor);
router.patch("/approvetimesheet", approveTimesheetFromAdmin);


module.exports = router;


