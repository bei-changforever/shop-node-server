const addressModel = require('../../models/AddressModel')

const addressService = {



    add: async ({username,name,tel,city,country,county,province,areaCode,isDefault,addressDetail,editTime,thisid}) => {
        return addressModel.create({
            username, name,tel,city,country,county,province,areaCode,isDefault,addressDetail,editTime,thisid
        })



       
    },

    updatedown: async({username,isDefault,thisid}) =>  {
        console.log(username,isDefault,thisid);
        return addressModel.updateMany({
            username
        },
        {
            isDefault,thisid
        })
    },



    getList: async(playload)=> {

        return addressModel.find({
            username: playload.username
        }).sort({
            editTime: -1
        })

        
        // 倒序排序
    },
    editAddress :async({
        thisid,
        username,
        _id,
        name, 
        tel,
        city,
        county,
        country,
        province,
        areaCode,
        isDefault,
        addressDetail,
        editTime
    }) => {

     return addressModel.find({
        _id,
        username
     }).updateOne({
        thisid,
        name, 
        tel,
        city,
        county,
        country,
        province,
        areaCode,
        isDefault,
        editTime,
        addressDetail
     })
    },
    delAddress: async (_id) => {
        return addressModel.deleteOne({
            _id
        })
    }
}

module.exports = addressService