
const { default: mongoose } = require("mongoose");

const { Schema } = mongoose;

const ATTENDACE = new Schema({


    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employee",
    },
    date: {
        type: Date,
        default: Date.now
    },
    loginTime: {
        type: String
    },
    logoutTime: {
        type: String
    },
    totalHours: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["present", "absent", "half day", "leave", "holiday"]

    },
    breaks: [{
        start: Date,
        end: Date,
        duration: Number
    }],
    loginIP: {
        type: String
    }

}, { timestamps: true })

module.exports = mongoose.model("attendace", ATTENDACE)