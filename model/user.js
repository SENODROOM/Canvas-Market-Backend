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
    }
})

const User = mongoose.model("User", userData)
module.exports = User

