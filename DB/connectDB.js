const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const connectDB = () => {
    const databaseUrl = process.env.DB_URI
    try {
      return mongoose.connect(databaseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
       })
    } catch (error) {
      console.log(error)
    }
}

module.exports = connectDB