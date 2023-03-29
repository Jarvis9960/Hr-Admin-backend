const express = require("express");
const router = express.Router();
const {
  addInvoiceForEmployee,
  getInvoiceForEmployee,
  getInvoiceOfContractor,
} = require("../controllers/InvoiceController");

router.post("/addinvoiceforemployee", addInvoiceForEmployee);
router.get("/getinvoiceofemployee", getInvoiceForEmployee);
router.get("/getinvoiceofcontractor", getInvoiceOfContractor);

module.exports = router;
