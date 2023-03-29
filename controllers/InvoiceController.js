const Invoice = require("../models/invoiceSchema");
const moment = require("moment-timezone");
const EmployeeProfile = require("../models/profileSchema");
const ContractorProfile = require("../models/contractorProfileSchema");

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
    const existingDate = await Invoice.findOne({
      DateFrom: startDate,
      DateTo: endDate,
    });
    const existingInvoiceNo = await Invoice.findOne({ InvoiceNo: invoiceNo });
    const existingServiceNo = await Invoice.findOne({ ServiceNo: serviceNo });
    
    
    if (existingDate) {
      return res
        .status(422)
        .json({
          status: false,
          message: "invoice is already filled for given dates",
        });
    }

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
    const { startDate, endDate, employeeId } = req.query;

    if (!employeeId) {
      return res.status(422).json({
        status: false,
        message: "unable to fetch Invoice. Employee ID is not present",
      });
    }

    if (!startDate || !endDate) {
      return res.status(422).json({
        status: false,
        message: "unable to fetch Invoice. startDate or EndDate is not present",
      });
    }

    const from = moment.tz(startDate, "DD-MM-YYYY", "UTC").toDate();
    const to = moment.tz(endDate, "DD-MM-YYYY", "UTC").toDate();

    const existingEmployee = await EmployeeProfile.findOne({
      EmployeeId: employeeId,
    }).populate("EmployeeId");

    if (!existingEmployee) {
      return res
        .status(422)
        .json({ status: false, message: "Employee profile is not updated" });
    }

    const existingEmployeePan = existingEmployee.PanNo;

    const savedInvoice = await Invoice.findOne({
      DateFrom: from,
      DateTo: to,
      Pan: existingEmployeePan,
    });

    if (!savedInvoice) {
      return res.status(422).json({
        status: false,
        message: "no invoices are present for given date for current employee",
      });
    }

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

const getInvoiceOfContractor = async (req, res) => {
  try {
    const { startDate, endDate, contractorId } = req.query;

    if (!startDate || !endDate || !contractorId) {
      return res
        .status(422)
        .json({ status: false, message: "please give all required field" });
    }

    const existingContractor = await ContractorProfile.findOne({_id: contractorId});

    if(!existingContractor) {
      return res.status(422).json({status: false, message: "there no contractor present of such id"});
    }

    const panNo = existingContractor.PanNo;
    
    const from = moment.tz(startDate, "DD-MM-YYYY", "UTC").toDate();
    const to = moment.tz(endDate, "DD-MM-YYYY", "UTC").toDate();

    const savedInvoice = await Invoice.findOne({
      DateFrom: from,
      DateTo: to,
      Pan: panNo,
    });

    if (!savedInvoice) {
      return res.status(422).json({
        status: false,
        message: "no invoices are present for given date for current employee",
      });
    }

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

module.exports = { addInvoiceForEmployee, getInvoiceForEmployee, getInvoiceOfContractor };
