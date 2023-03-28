const Invoice = require("../models/invoiceSchema");
const moment = require("moment-timezone");
const EmployeeProfile = require("../models/profileSchema");

const addInvoiceForEmployee = async (req, res) => {
  try {
    const {
      from,
      to,
      invoiceNo,
      serviceNo,
      invoiceDate,
      supplier,
      name,
      address,
      aadhar,
      pan,
      phone,
      table,
      amountInWord,
      Bankname,
      AccountNumber,
      IFSC,
    } = req.body;

    if (
      !from ||
      !to ||
      !invoiceNo ||
      !serviceNo ||
      !invoiceDate ||
      !supplier ||
      !name ||
      !address ||
      !aadhar ||
      !pan ||
      !phone ||
      !table ||
      !amountInWord ||
      !Bankname ||
      !AccountNumber ||
      !IFSC
    ) {
      return res.status(201).json({
        status: false,
        message: "Please filled all the required field properly",
      });
    }

    if (invoiceNo === serviceNo) {
      return res.status(422).json({
        status: false,
        message: "invoices and services number should not be same",
      });
    }

    const startDate = moment.tz(from, "DD-MM-YYYY", "UTC").toDate();
    const endDate = moment.tz(to, "DD-MM-YYYY", "UTC").toDate();
    const InvoiceDate = moment.tz(invoiceDate, "DD-MM-YYYY", "UTC").toDate();

    const existingInvoiceNo = await Invoice.findOne({ InvoiceNo: invoiceNo });
    const existingServiceNo = await Invoice.findOne({ ServiceNo: serviceNo });

    if (existingInvoiceNo || existingServiceNo) {
      return res.status(422).json({
        status: false,
        message: "Invoice number or service number already exist",
      });
    }

    const newInvoice = new Invoice({
      DateFrom: startDate,
      DateTo: endDate,
      InvoiceNo: invoiceNo,
      ServiceNo: serviceNo,
      InvoiceDate: InvoiceDate,
      Supplier: supplier,
      Name: name,
      Address: address,
      Aadhar: aadhar,
      Pan: pan,
      Phone: phone,
      Table: table,
      AmountInWord: amountInWord,
      BankName: Bankname,
      AccountNumber: AccountNumber,
      IFSC: IFSC,
    });

    const savedInvoice = await newInvoice.save();

    if (savedInvoice) {
      return res.status(201).json({
        status: true,
        message: "succesfully created invoice",
        savedInvoice,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

const getInvoiceForEmployee = async (req, res) => {
  try {
    const { employeeId } = req.query;

    if (!employeeId) {
      return res.status(422).json({
        status: false,
        message: "unable to fetch Invoice. Employee ID is not present",
      });
    }

    const existingEmployee = await EmployeeProfile.findOne({
      EmployeeId: employeeId,
    }).populate("EmployeeId");

    if (!existingEmployee) {
      return res
        .status(422)
        .json({ status: false, message: "Employee profile is not updated" });
    }

    const existingEmployeePan = existingEmployee.PanNo;

    const savedInvoice = await Invoice.findOne({ Pan: existingEmployeePan });

    if (savedInvoice) {
      return res.status(201).json({
        status: true,
        message: "successfully fetched invoice for current employee",
        savedInvoice,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(501)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

module.exports = { addInvoiceForEmployee, getInvoiceForEmployee };
