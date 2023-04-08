const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  DateFrom: {
    type: Date,
    required: true,
  },
  DateTo: {
    type: Date,
    required: true,
  },
  InvoiceNo: {
    type: Number,
    required: true,
  },
  ServiceNo: {
    type: Number,
    required: true,
  },
  InvoiceDate: {
    type: Date,
    required: true,
  },
  Supplier: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  Address: {
    type: String,
    required: true,
  },
  Aadhar: {
    type: String,
    required: true,
  },
  Pan: {
    type: String,
    required: true,
  },
  Phone: {
    type: String,
    required: true,
  },
  Table: [
    {
      Particular: {
        type: String,
      },
      Remark: {
        type: String,
      },
      Amount: {
        type: String,
      },
      SerialNo: {
        type: String,
      },
    },
  ],
  AmountInWord: {
    type: String,
    required: true,
  },
  BankName: {
    type: String,
    required: true,
  },
  AccountNumber: {
    type: Number,
    required: true,
  },
  IFSC: {
    type: String,
    required: true,
  },
   Approve: {
    type: Boolean,
    default: false,
  },
  Sign: {
    type: String,
  },
});


const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
