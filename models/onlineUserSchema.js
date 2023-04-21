const mongoose = require("mongoose");

const onlineUserSchema = new mongoose.Schema({
  UserEmail: {
    type: String,
    required: true,
  },
  UserOnlineStatus: {
    type: Boolean,
    required: true,
  },
  IsAdmin: {
    type: Boolean,
    default: false
  }
});


const onlineUser = mongoose.model("Onlineuser", onlineUserSchema);


module.exports = onlineUser;
