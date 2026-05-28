const mongoose = require("mongoose");

const { Schema } = mongoose;

const EMPLOYEE_INFO_SCHEMA = new Schema({
    employeeId: {
        type: String,
        unique: true
    },
    fullName: {
        type: String,
    },
    phone: {
        type: String
    },
    photo: {
        type: String
    },
    role: {
        type: String,
        enum: ["employee", "hr", "admin"],
        default: 'employee'
    },
    department: {
        type: String
    },
    designation: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    joiningDate: { type: Date },
    salary: {
        type: Number
    },
    email: {
        type: String
    },
    password: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model("employee", EMPLOYEE_INFO_SCHEMA);