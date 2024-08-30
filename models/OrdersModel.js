const mongoose = require('mongoose')
const Schema = mongoose.Schema





const ordersType = {
    username: String,

    productId: String,

    skuOrigin:Object,
    addressInfo:Object,
    editTime: Date,
    buy_option: Array,

    order_id: String,
    
    totalPrice: Number,

    productFinallName: String,

    isChoose:Boolean
}

const ordersModel = mongoose.model('order',new Schema(ordersType))

module.exports = ordersModel