const express = require("express");
const router = express.Router();
const {
  addInvoiceForEmployee,
  getInvoiceForEmployee,
  getInvoiceOfContractor,
  approveInvoiceByAdmin,
} = require("../controllers/InvoiceController");
const { protectedRoute } = require("../middlewares/protectedMiddleware");

router.post("/addinvoiceforemployee", addInvoiceForEmployee);
router.get("/getinvoiceofemployee", getInvoiceForEmployee);
router.get("/getinvoiceofcontractor", getInvoiceOfContractor);
router.patch("/approveinvoicebyadmin", protectedRoute, approveInvoiceByAdmin)

module.exports = router;
