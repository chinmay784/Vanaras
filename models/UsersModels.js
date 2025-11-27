const mongoose = require("mongoose");

const UserModel = new mongoose.Schema({
    userName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        unique: true,
        trim: true
    },
    role: {
        type: String,
        trim: true
    },
});

module.exports = mongoose.model("User",UserModel);