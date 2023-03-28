const express = require("express");
const router = express.Router();
const {
  addVendor,
  getVendorForAdmin,
} = require("../controllers/employeeController");
const { protectedRoute } = require("../middlewares/protectedMiddleware");

router.post("/addvendor", protectedRoute, addVendor);
router.get("/getvendor", protectedRoute, getVendorForAdmin);

module.exports = router;
