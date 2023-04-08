const express = require("express");
const router = express.Router();
const {
  addInvoiceForEmployee,
  getInvoiceForEmployee,
  getInvoiceOfContractor,
  approveInvoiceByAdmin,
} = require("../controllers/InvoiceController");
const { protectedRoute } = require("../middlewares/protectedMiddleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads/invoicesign"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!"); // custom this message to fit your needs
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post(
  "/addinvoiceforemployee",
  upload.single("Sign"),
  addInvoiceForEmployee
);
router.get("/getinvoiceofemployee", getInvoiceForEmployee);
router.get("/getinvoiceofcontractor", getInvoiceOfContractor);
router.patch("/approveinvoicebyadmin", protectedRoute, approveInvoiceByAdmin)

module.exports = router;
