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
const sendEmails = require("./routes/sendEmailRoutes");
const contractorAuth = require("./routes/contractorAuthRoute");
const contractorProfile = require("./routes/contractorProfileRoute");
const cron = require("node-cron");
const moment = require("moment");
const invoiceRoute = require("./routes/invoiceRoute");
const vendorRoute = require("./routes/addVendorRoute");
const vendorProfile = require("./routes/vendorProfileRoute");
const vendorAuth = require("./routes/vendorAuthRoute");
const timesheetVendor = require("./routes/timesheetVendorRoute");
const jwt = require("jsonwebtoken");
const EmployeeAuth = require("./models/employeeAuth");
const onlineUser = require("./models/onlineUserSchema");
const notification = require("./models/notficationSchema");
const notificaitonRoute = require("./routes/notificationRoute");
const admin = require("./models/adminSchema");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);
dotenv.config({ path: path.resolve(__dirname + "/config.env") });
app.use(adminAuth);
app.use(employeeAuth);
app.use(addEmployee);
app.use(addHoliday);
app.use(leave);
app.use(employeeProfile);
app.use(workingHourRoute);
app.use(timesheetContractor);
app.use(sendEmails);
app.use(contractorAuth);
app.use(contractorProfile);
app.use(invoiceRoute);
app.use(vendorRoute);
app.use(vendorProfile);
app.use(vendorAuth);
app.use(timesheetVendor);
app.use(notificaitonRoute);
app.use(express.static(path.join(__dirname, "public")));

const port = 5000 || process.env.PORT;
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
  pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  },
});

var timesheet;
let intervalDays = 22;
// let sessionStore = {};

io.on("connection", async (socket) => {
  console.log("connection is successful to socket");

  try {
    let decode;
    let existingEmployee;
    let token = socket.handshake.query.cookie;

    if (token) {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    }

    if (decode) {
      existingEmployee = await EmployeeAuth.findOne({
        _id: decode.Employee_id,
      });
    }

    if (existingEmployee) {
      const response = await onlineUser.findOne({
        UserEmail: existingEmployee.Email,
      });

      if (response) {
        let updatedOnlineStatus = await onlineUser.updateOne(
          { UserEmail: existingEmployee.Email },
          { $set: { UserOnlineStatus: true } }
        );

        if (updatedOnlineStatus.acknowledged) {
          console.log("user session is updated to Online");
        }
      }
    }
  } catch (error) {
    console.log(error);
  }

  try {
    let decode;
    let existingAdmin;
    let token = socket.handshake.query.cookie;

    if (adminId) {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    }
    if (decode) {
      existingAdmin = await admin.findOne({ _id: decode.admin_id });
    }

    if (existingAdmin) {
      const response = await onlineUser.findOne({
        UserEmail: existingAdmin.Email,
      });

      if (response) {
        let updateOnlineStatus = await onlineUser.updateOne(
          { UserEmail: existingAdmin },
          { $set: { UserOnlineStatus: true } }
        );

        if (updateOnlineStatus.acknowledged) {
          console.log("admin is online");
        }
      } else {
        let addAdminStatus = new onlineUser({
          UserEmail: existingAdmin.Email,
          UserOnlineStatus: true,
        });

        let savedResponse = await addAdminStatus.save();

        if (savedResponse) {
          console.log("admin is online");
        }
      }
    }
  } catch (error) {
    console.log(error);
  }

  socket.on("user-login", async (userID) => {
    try {
      let decode;
      let existingEmployee;
      if (userID) {
        decode = jwt.verify(userID, process.env.JWT_SECRET);
      }
      if (decode) {
        existingEmployee = await EmployeeAuth.findOne({
          _id: decode.Employee_id,
        });
      }
      if (existingEmployee) {
        // sessionStore[existingEmployee.Email] = userID;
        const response = await onlineUser.findOne({
          UserEmail: existingEmployee.Email,
        });

        if (response) {
          let updatedOnlineStatus = await onlineUser.updateOne(
            { UserEmail: existingEmployee.Email },
            { $set: { UserOnlineStatus: true } }
          );

          if (updatedOnlineStatus.acknowledged) {
            console.log("user session is updated to online");
          }
        } else {
          let addOnlineStatus = new onlineUser({
            UserEmail: existingEmployee.Email,
            UserOnlineStatus: true,
          });

          const response = await addOnlineStatus.save();

          if (response) {
            console.log("user session is updated to online");
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("admin-login", async (adminId) => {
    try {
      let decode;
      let existingAdmin;

      if (adminId) {
        decode = jwt.verify(adminId, process.env.JWT_SECRET);
      }
      if (decode) {
        existingAdmin = await admin.findOne({ _id: decode.admin_id });
      }

      if (existingAdmin) {
        const response = await onlineUser.findOne({
          UserEmail: existingAdmin.Email,
        });

        if (response) {
          let updateOnlineStatus = await onlineUser.updateOne(
            { UserEmail: existingAdmin },
            { $set: { UserOnlineStatus: true } }
          );

          if (updateOnlineStatus.acknowledged) {
            console.log("admin is online");
          }
        } else {
          let addAdminStatus = new onlineUser({
            UserEmail: existingAdmin.Email,
            UserOnlineStatus: true,
          });

          let savedResponse = await addAdminStatus.save();

          if (savedResponse) {
            console.log("admin is online");
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("timesheet", (timesheetInfo) => {
    console.log(timesheetInfo);
    timesheet = timesheetInfo;
  });

  cron.schedule("6 13 * * *", async () => {
    const employees = await employee.find();
    const currentDate = moment();
    employees.forEach((employee) => {
      const joinDate = moment(employee.JoinDate, "DD-MM-YYYY");
      const daysSinceJoin = currentDate.diff(joinDate, "days");
      console.log(daysSinceJoin % intervalDays);
      if (daysSinceJoin % intervalDays === 0) {
        socket.emit("Invoice-alert", {
          email: employee.Email,
          message: "Please filled your Invoices",
        });
      }
    });
  });

  socket.on("invoice-filled", async (data) => {
    try {
      const onlineUserStatus = await onlineUser.findOne({
        UserEmail: data.email,
      });

      if (onlineUserStatus.UserOnlineStatus) {
        const newNotification = new notification({
          UserEmail: data.email,
          NotificationMessage: data.message,
          Sent: true,
        });
        const savedResponse = await newNotification.save();
        io.emit("invoice-filled-notified", savedResponse);
      } else {
        const newNotification = new notification({
          UserEmail: data.email,
          NotificationMessage: data.message,
        });

        const savedResponse = await newNotification.save();

        if (savedResponse) {
          console.log("notification is saved");
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("timesheet-edited", (data) => {
    io.emit("timesheet-edited-notified", data);
  });

  socket.on("user-logout", async (data) => {
    try {
      let decode;
      let existingEmployee;
      if (data) {
        decode = jwt.verify(data, process.env.JWT_SECRET);
      }
      if (decode) {
        existingEmployee = await EmployeeAuth.findOne({
          _id: decode.Employee_id,
        });
      }
      if (existingEmployee) {
        // sessionStore[existingEmployee.Email] = userID;
        const response = await onlineUser.findOne({
          UserEmail: existingEmployee.Email,
        });

        if (response) {
          let updatedOnlineStatus = await onlineUser.updateOne(
            { UserEmail: existingEmployee.Email },
            { $set: { UserOnlineStatus: false } }
          );

          if (updatedOnlineStatus.acknowledged) {
            console.log("user session is updated to Offline");
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("admin-logout", async (adminId) => {
    try {
      let decode;
      let existingAdmin;
      if (adminId) {
        decode = jwt.verify(adminId, process.env.JWT_SECRET);
      }
      if (decode) {
        existingAdmin = await admin.findOne({
          _id: decode.admin_id,
        });
      }
      if (existingAdmin) {
        // sessionStore[existingAdmin.Email] = userID;
        const response = await onlineUser.findOne({
          UserEmail: existingAdmin.Email,
        });

        if (response) {
          let updatedOnlineStatus = await onlineUser.updateOne(
            { UserEmail: existingAdmin.Email },
            { $set: { UserOnlineStatus: false } }
          );

          if (updatedOnlineStatus.acknowledged) {
            console.log("user session is updated to Offline");
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", async () => {
    let called = false;

    try {
      let decode;
      let existingEmployee;
      let token = socket.handshake.query.cookie;

      if (token) {
        decode = jwt.verify(token, process.env.JWT_SECRET);
      }

      if (decode) {
        existingEmployee = await EmployeeAuth.findOne({
          _id: decode.Employee_id,
        });
      }

      if (existingEmployee) {
        // sessionStore[existingEmployee.Email] = userID;
        const response = await onlineUser.findOne({
          UserEmail: existingEmployee.Email,
        });

        if (response) {
          let updatedOnlineStatus = await onlineUser.updateOne(
            { UserEmail: existingEmployee.Email },
            { $set: { UserOnlineStatus: false } }
          );

          if (updatedOnlineStatus.acknowledged) {
            console.log("user session is updated to Offline");
          }
        }
      }
    } catch (error) {
      console.log(error);
    }

    try {
      let decode;
      let existingAdmin;
      let token = socket.handshake.query.cookie;

      if (adminId) {
        decode = jwt.verify(token, process.env.JWT_SECRET);
      }
      
      if (decode) {
        existingAdmin = await admin.findOne({
          _id: decode.admin_id,
        });
      }

      if (existingAdmin) {
        // sessionStore[existingAdmin.Email] = userID;
        const response = await onlineUser.findOne({
          UserEmail: existingAdmin.Email,
        });

        if (response) {
          let updatedOnlineStatus = await onlineUser.updateOne(
            { UserEmail: existingAdmin.Email },
            { $set: { UserOnlineStatus: false } }
          );

          if (updatedOnlineStatus.acknowledged) {
            console.log("user session is updated to Offline");
          }
        }
      }
    } catch (error) {
      console.log(error);
    }

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
                called = true;
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
