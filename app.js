const express = require('express')
const cors = require('cors');
const app = express()
app.use(cors());
const port = 5001

const mongoose = require("mongoose")
const User = require("./model/user")
const Products = require("./model/Products")

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(express.urlencoded({extended: true}))


mongoose.connect("mongodb://127.0.0.1:27017/ArtisticUnleashed").then(()=>{
    console.log("Database Connected")
}).catch((e)=>{
    console.log(e)
    console.log("Database Can't Be Connected")
})



app.post('/submit', cors(),async (req, res) => {

  console.log(req.body);

    const userData = new User(req.body);
    let requestStore = await userData.save();

    res.status(200).json({ message: "Message sent successfully" });


})
app.post('/Products', cors(),async (req, res) => {

  console.log(req.body);

    const ProductsData = new Products(req.body);
    let requestStore = await ProductsData.save();

    res.status(200).json({ message: "Message sent successfully" });


})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})