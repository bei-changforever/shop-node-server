const mongoose = require('mongoose')
const Shcema = mongoose.Schema
const userType = {
    username:String,
    password:String,
    avatar:String,
    introduction:String,
    imgsrc: String
}

const userModel =   mongoose.model("user",new Shcema(userType))

module.exports = userModel