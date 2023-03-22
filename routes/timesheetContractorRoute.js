const express = require("express");
const router = express.Router();
const { addTimesheet, getTimesheet } = require("../controllers/timesheetContractorController");

router.post("/addtimesheet", addTimesheet);
router.get("/gettimesheet", getTimesheet);


module.exports = router;


