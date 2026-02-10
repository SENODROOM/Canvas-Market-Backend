const mongoose = require("mongoose")

const userData = new mongoose.Schema({
    fname:{
        type: String
    },
    femail:{
        type: String
    },
    fmsg:{
        type: String
    },
    fimg:{
        type: String
    },
     name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone:    { type: String, default: '' },
    address:  { type: String, default: '' },
    photo:    { type: String, default: null },   // base64 string from FileReader
    emoji:    { type: String, default: '👤' },
}, { timestamps: true })

const User = mongoose.model("User", userData)
module.exports = User

