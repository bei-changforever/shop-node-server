const mongoose = require('mongoose')
const Schema =  mongoose.Schema

const addressType = {
    username: String,
    addressDetail: String,
    areaCode: String,
    city: String,
    country: String,
    county: String,
    isDefault: Boolean,
    name: String,
    province: String,
    tel: String,
    editTime: Date,
    thisid:Number,
  
}

const addressModel = mongoose.model('address', new Schema(addressType))


module.exports = addressModel