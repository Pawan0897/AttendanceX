const { default: mongoose } = require("mongoose");

const { Schema } = mongoose;
const USER = new Schema({
    // identity
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // role — all three in one place
    role: { type: String, enum: ['admin', 'hr', 'employee'], default: 'employee' },

    // profile
    userId: { type: String, ref: 'User' },
    phone: { type: String, default: null },
    image: { type: String, default: null },
    designation: { type: String, default: null },
    department: { type: String, default: null },
    salary: { type: Number, default: null },

    // status
    isActive: { type: Boolean, default: true },
    joiningDate: { type: Date },
    lastLogin: { type: Date, default: null },
    refreshToken: { type: String, default: null },

}, { timestamps: true });

module.exports = mongoose.model("user", USER)