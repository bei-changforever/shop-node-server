const mongoose = require('mongoose')
const Schema =  mongoose.Schema

const starType = {
    username: String,
    productId: String,
    title:String,
    keywords:String,
    price:String,
    star: Boolean,
    imgsrc:String,
    isCheck:Boolean
}

const starModel = mongoose.model('star',new Schema(starType))
module.exports = starModel