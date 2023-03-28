const express = require("express");
const router = express.Router();
const {
  addTimesheetForVendor,
  getSortedDataForVendor,
  getTimesheetForVendor,
  editTimesheetDateForVendor,
} = require("../controllers/timesheetVendorController");
const {
  protectedRouteForVendor,
} = require("../middlewares/protectedMiddleware");

router.post(
  "/addtimesheetofvendor",
  protectedRouteForVendor,
  addTimesheetForVendor
);
router.get(
  "/getcurrentvendortimesheet",
  protectedRouteForVendor,
  getTimesheetForVendor
);
router.get(
  "/getsortedtimesheetforvendor",
  protectedRouteForVendor,
  getSortedDataForVendor
);
router.patch(
  "/editvendortimesheet",
  protectedRouteForVendor,
  editTimesheetDateForVendor
);

module.exports = router;
