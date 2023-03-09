const express = require("express");
const {
  holidayController,
  getHoliday,
} = require("../controllers/holidayController");
const { protectedRoute } = require("../middlewares/protectedMiddleware");
const router = express.Router();

router.post("/addHoliday", protectedRoute, holidayController);
router.get("/getHolidays", protectedRoute, getHoliday);

module.exports = router;
