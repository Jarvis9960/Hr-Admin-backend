const Admin = require("../models/adminSchema");
const employeeAuth = require("../models/employeeAuth");
const Contractor = require("../models/contractorAuth");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve("./config.env") });

module.exports.protectedRoute = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      if (!token) {
        throw new Error("something went wrong");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await Admin.findOne({ _id: decoded.admin_id });

      next();
    } catch (error) {
      return res.status(442).json({ message: "Invalid Auth" });
    }
  } else {
    return res.status(422).json({ message: "No token" });
  }
};

module.exports.protectedRouteForEmployee = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      if (!token) {
        throw new Error("something went wrong");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await employeeAuth.findOne({ _id: decoded.Employee_id });

      next();
    } catch (error) {
      return res.status(442).json({ message: "Invalid Auth" });
    }
  } else {
    return res.status(422).json({ message: "No token" });
  }
};

module.exports.protectedRouteForContractor = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      if (!token) {
        throw new Error("something went wrong");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await Contractor.findOne({ _id: decoded.contractor_id });

      next();
    } catch (error) {
      return res.status(442).json({ message: "Invalid Auth" });
    }
  } else {
    return res.status(422).json({ message: "No token" });
  }
};

module.exports.protectedRouteForVendor = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      if (!token) {
        throw new Error("something went wrong");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await VendorAuth.findOne({ _id: decoded.vendor_id });

      next();
    } catch (error) {
      return res.status(442).json({ message: "Invalid Auth" });
    }
  } else {
    return res.status(422).json({ message: "No token" });
  }
};


