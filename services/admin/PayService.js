
const payModel = require('../../models/PayModel')
const payService = {
    submitOrders: async ({
        username,
        goodsName,
        goodsPrice,
        goodsNum,
        order_status,
        order_id
    }) => {
        return payModel.create({


            username,
            goodsName,
            goodsPrice,
            goodsNum,
            order_status,
            order_id


        })
    },
    getCurrentOrder: async ({username,order_id}) => {
        return payModel.find({
            username,order_id
        })
    },
    pay: async ({username,order_id,order_status}) => {
        return payModel.find({
            username,order_id
        }).updateOne({
            order_status
        })
    },
    changePayStatus: async ({username, order_id,order_status}) => {
      console.log('username==>',username);
      console.log('order_id==>',order_id);
      console.log('order_status==>',order_status);
        return await payModel.find({
            username, 
            order_id
        }).updateOne({
            order_status
        })
    },
    checkStatus: async ({username,order_status}) => {
        return payModel.find({
            username,order_status
        })
    },
    delOrders: async ({username,order_id}) => {
        return payModel.deleteOne({
            username,order_id
        })
    },
    changeStatus: async ({username,order_id,order_status}) => {
        return payModel.find({
            username,order_id
        }).updateOne({
            order_status
        })
    }
}

module.exports = payService