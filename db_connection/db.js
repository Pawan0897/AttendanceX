const mongoose = require("mongoose")

const db_connection = async () => {
    await mongoose.connect("mongodb://localhost:27017/attendanceX").then(() => {
        console.log("db connected !!!!");

    }).catch((err) => console.log(err, "errrrrrrrr")
    )
}
module.exports = db_connection;