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
const workingHourRoute = require("./routes/workingHourRoute");
const path = require("path");
const socket = require("socket.io");
const employeeWorkingHour = require("./models/employeeWorkingHourSchema");
const employee = require("./models/EmployeeSchema");
const timesheetContractor = require("./routes/timesheetContractorRoute");
const contractorAuth = require("./routes/contractorAuthRoute");
const contractorProfile = require("./routes/contractorProfileRoute")
const invoiceRoute = require("./routes/invoiceRoute");
const vendorRoute = require("./routes/addVendorRoute");
const vendorProfile = require("./routes/vendorProfileRoute");
const vendorAuth = require("./routes/vendorAuthRoute");
const timesheetVendor = require("./routes/timesheetVendorRoute")

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
app.use(workingHourRoute);
app.use(timesheetContractor);
app.use(contractorAuth);
app.use(contractorProfile);
app.use(invoiceRoute);
app.use(vendorRoute);
app.use(vendorProfile);
app.use(vendorAuth);
app.use(timesheetVendor);

const port = 5000;
const server = app.listen(port, (req, res) => {
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

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

var timesheet;
var invoiceData;
console.log(invoiceData);

io.on("connection", (socket) => {
  console.log("connection is successful to socket");

  socket.on("timesheet", (timesheetInfo) => {
    console.log(timesheetInfo);
    timesheet = timesheetInfo;
  });
  
  socket.on("invoice-filled", (data) => {
       invoiceData = data;
     setTimeout(() => {
      invoiceData = "";
    }, 5000);
  });

  socket.emit("invoice-filled-notified", invoiceData);

  socket.on("disconnect", (socket) => {
    let called = false;

    if (!called) {
      (async function () {
        try {
          const email = timesheet.currentUserEmail;

          const emailExist = await employeeWorkingHour.findOne({
            EmployeeEmail: email,
          });

          if (!emailExist) {
            const Employee = await employee.findOne({ Email: email });

            const EmployeeId = Employee._id;

            const timesheetObject = {
              Workinghours: timesheet.timesheet,
              CurrentDate: timesheet.date,
            };

            const newEmployeeWorkingHour = new employeeWorkingHour({
              Employee: EmployeeId,
              EmployeeEmail: email,
              Timesheet: [timesheetObject],
            });

            const savedResponse = await newEmployeeWorkingHour.save();

            if (savedResponse) {
              called = true;
              return console.log("Timesheet is saved");
            }
          } else {
            const currentDate = new Date().toLocaleDateString("en-IN", {
              dateStyle: "long",
            });

            const latestEmployeeWorkingHour = emailExist.Timesheet.length - 1;

            const timeSheetObject = {
              Workinghours: timesheet.timesheet,
              CurrentDate: timesheet.date,
            };

            if (
              emailExist.Timesheet[latestEmployeeWorkingHour].CurrentDate ===
              currentDate
            ) {
              const updateWorkingHour = await employeeWorkingHour.updateOne(
                { EmployeeEmail: email },
                {
                  $set: {
                    [`Timesheet.${latestEmployeeWorkingHour}`]: timeSheetObject,
                  },
                }
              );

              if (updateWorkingHour) {
                called = true;
                return console.log("Timesheet Updated Successfully");
              }
            } else {
              const updateWorkingHour = await employeeWorkingHour.updateOne(
                { EmployeeEmail: email },
                { $push: { Timesheet: timeSheetObject } }
              );

              if (updateWorkingHour) {
                called = true
                return console.log("New Day TimeSheet Pushed");
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      })();
    }
  });
});
