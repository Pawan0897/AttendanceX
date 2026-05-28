const mongoose = require("mongoose")

const db_connection = async () => {
    await mongoose.connect(process.env.MONGODB_URI).then(() => {
        console.log("db connected !!!!");

    }).catch((err) => console.log(err, "errrrrrrrr")
    )
}
module.exports = db_connection;