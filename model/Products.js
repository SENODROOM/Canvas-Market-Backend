const mongoose = require("mongoose")

const ProductsData = new mongoose.Schema({
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

const Products = mongoose.model("Products", ProductsData)
module.exports = Products