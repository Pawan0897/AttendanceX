
const { default: mongoose } = require("mongoose");
const moment = require("moment")
const { Schema } = mongoose;

const ATTENDACE = new Schema({


    employeeId: {
        type: String,
        ref: "employee",
    },
    date: {
        type: String,
        default: () => moment().format('MMMM Do YYYY')
    },
    loginTime: {
        type: String,
        default: () => moment().format('MMMM Do YYYY, h:mm:ss a')
    },
    logoutTime: {
        type: String,
        default: null
    },
    totalHours: {
        type: String,
        default: null
    },
    totalSeconds: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["present", "absent", "half day", "leave", "holiday"],
        default: "present"

    },
    breaks: [
        {
            start: { type: String, default: null },
            end: { type: String, default: null },
            duration: { type: Number, default: 0 }
        }
    ],
    loginIP: {
        type: String,
        default: null
    }

}, { timestamps: true })

module.exports = mongoose.model("attendace", ATTENDACE)