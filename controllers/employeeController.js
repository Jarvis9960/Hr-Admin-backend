const Employee = require("../models/EmployeeSchema");

const addEmployeeController = async (req, res) => {
  try {
    const { firstName, lastName, email, mobileNo, joinDate, role, contractor } = req.body;

    console.log(firstName, lastName, email, mobileNo, joinDate, role);

    if (!firstName || !lastName || !email || !mobileNo || !joinDate || !role || !contractor) {
      return res.status(422).json({
        status: false,
        message: "Please filled all the required field",
      });
    }

    const emailExist = await Employee.findOne({ Email: email });
    const mobileExist = await Employee.findOne({ MobileNo: mobileNo });

    if (emailExist || mobileExist) {
      return res.status(422).json({
        status: false,
        message: "Employee or email or mobile is already registered",
      });
    }

    const fullName = `${firstName} ${lastName}`;
    const newEmployee = new Employee({
      Name: fullName,
      Email: email,
      MobileNo: mobileNo,
      JoinDate: joinDate,
      Role: role,
      Contractor: contractor
    });

    const savedResponse = await newEmployee.save();

    if (savedResponse) {
      return res.status(201).json({
        status: true,
        message: "Employee added successfully",
        savedResponse,
      });
    }
  } catch (error) {
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

const getEmployeeController = async (req, res) => {
  try {
    const response = await Employee.find();

    if (response) {
      res
        .status(201)
        .json({
          status: true,
          message: "successfully fetched Employees data",
          res: response,
        });
    }
  } catch (error) {
    console.log(error);
    res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

const addVendor = async (req, res) => {
  try {
    const { vendorName, vendorEmail } = req.body;

    if (!vendorName || !vendorEmail) {
      return res.status(422).json({
        status: false,
        message: "please filled required fields properly",
      });
    }

    const existingVendorEmail = await Vendor.findOne({
      VendorEmail: vendorEmail,
    });

    if (existingVendorEmail) {
      return res.status(422).json({
        status: false,
        message: "vendor email is already register to company",
      });
    }

    const newVendor = new Vendor({
      VendorName: vendorName,
      VendorEmail: vendorEmail,
    });

    const savedVendor = await newVendor.save();

    if (savedVendor) {
      return res
        .status(201)
        .json({ status: true, message: "succesfully added new Vendor" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: false, message: "something went wrong" });
  }
};

const getVendorForAdmin = async (req, res) => {
  try {
    const savedVendors = await Vendor.find();

    if (savedVendors > 1) {
      return res
        .status(422)
        .json({ status: false, message: "no vendors are present in company" });
    }

    return res.status(201).json({
      status: true,
      message: "succesfully fetched vendors data",
      res: savedVendors,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: false, message: "something went wrong" });
  }
};

const getEmployeeforContractor = async (req, res) => {
  try {
    const { ContractorName } = req.query;

    if (!ContractorName) {
      return res
        .status(422)
        .json({
          status: false,
          message: "contractor name is not present in query",
        });
    }

    const savedEmployeeUnderContractor = await Employee.find({
      Contractor: ContractorName,
    });

    if (!savedEmployeeUnderContractor) {
      return res
        .status(422)
        .json({
          status: false,
          message: "no employees are present under contractor",
        });
    }

    return res
      .status(201)
      .json({
        status: true,
        message: "successfully fetched employee under your team",
        savedEmployeeUnderContractor,
      });
  } catch (error) {
    console.log(error);
    res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

module.exports = { addEmployeeController, getEmployeeController, getEmployeeforContractor, addVendor, getVendorForAdmin };
