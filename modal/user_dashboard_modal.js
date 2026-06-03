const { default: mongoose } = require("mongoose");

const { Schema } = mongoose;

const USER = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "hr"],
        default: "hr"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    token: {
        type: String,
    },
    phone: {
        type: String,
        default: null
    },
    image: {
        type: String,
        default: null
    },

    lastLogin: {
        type: Date,
        default: null
    }
}, { timestamps: true })

module.exports = mongoose.model("user", USER)