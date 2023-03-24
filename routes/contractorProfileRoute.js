const express = require("express");
const { contractorProfileController, getCurrentContractorProfile } = require("../controllers/contractorProfileController");
const router = express.Router();
// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "../public/uploads"));
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.originalname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// function checkFileType(file, cb) {
//   const filetypes = /jpg|jpeg|png/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (extname && mimetype) {
//     return cb(null, true);
//   } else {
//     cb("Images only!"); // custom this message to fit your needs
//   }
// }

// const upload = multer({
//   storage,
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   },
// });

// const multipleUpload = upload.fields([{ name: "Panimage", maxCount: 1 }, {name: "Adharimage", maxCount: 1}]);

const {
  protectedRouteForEmployee,
  protectedRoute,
  protectedRouteForContractor,
} = require("../middlewares/protectedMiddleware");

router.post("/addcontractorprofile", contractorProfileController);
router.get("/currentcontractorprofile", protectedRouteForContractor, getCurrentContractorProfile);



module.exports = router;
