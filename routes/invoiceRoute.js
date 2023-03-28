const express = require("express");
const router = express.Router();
const {
  addInvoiceForEmployee,
  getInvoiceForEmployee,
} = require("../controllers/InvoiceController");

router.post("/addinvoiceforemployee", addInvoiceForEmployee);
router.get("/getinvoiceofemployee", getInvoiceForEmployee);

module.exports = router;
