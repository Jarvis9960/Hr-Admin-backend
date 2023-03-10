const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./DB/connectDB");
const cors = require("cors");
const adminAuth = require("./routes/adminAuthRoute");
const employeeAuth = require("./routes/employeeAuthRoute");
const addEmployee = require("./routes/addEmployeeRoute");
const addHoliday = require("./routes/holidayRoute");
const leave = require("./routes/leaveRoute");
const employeeProfile = require("./routes/employeeProfileRoute");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
dotenv.config({ path: path.resolve(__dirname + "/config.env") });
app.use(adminAuth);
app.use(employeeAuth);
app.use(addEmployee);
app.use(addHoliday);
app.use(leave);
app.use(employeeProfile);

const port = 5000;
app.listen(port, (req, res) => {
  console.log(`connection is successful on ${port}`);
});

connectDB()
  .then((result) => {
    console.log("connection to db successful");
  })
  .catch((err) => {
    console.log("connection failed");
    console.log(err);
  });
