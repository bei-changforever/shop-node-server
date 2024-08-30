
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const payType = {
    username:String,
    goodsName:Object,
    goodsPrice:Number,
    goodsNum: Number,
    order_id: String,
    order_status: Number
}

const payModel = mongoose.model('pay',new Schema(payType))

module.exports = payModel