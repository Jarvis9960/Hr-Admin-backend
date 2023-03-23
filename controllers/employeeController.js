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

const getEmployeeforContractor = async (req, res) => {
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
}

module.exports = { addEmployeeController, getEmployeeController, getEmployeeforContractor };
