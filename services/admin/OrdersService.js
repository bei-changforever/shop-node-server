const ordersModel = require('../../models/OrdersModel')

const ordersService = {
    
    add: async ({ buy_option, isChoose,
        username, productId, skuOrigin, addressInfo, editTime, productFinallName }) => {
        return ordersModel.create({
            buy_option, isChoose, username, productId, skuOrigin, addressInfo, editTime, productFinallName
        })
    },

    getList: async ({ username }) => {
        return ordersModel.find({
            username
        }).sort({
            editTime: -1
        })
    },


    getOneList: async ({ username, productId }) => {
        return ordersModel.find({
            username, productId
        })
    },


    chachong: async ({ username, productId, productFinallName }) => {
        return ordersModel.find({
            username, productId, productFinallName
        })
    },


    delChong: async ({ productFinallName, username }) => {

        return ordersModel.deleteMany({
            productFinallName,
            username
        })
    },
    updateCount: async ({uesrname,productFinallName,skuOrigin}) => {
        return ordersModel.find({
            uesrname,
            productFinallName
        }).updateOne({
            skuOrigin
        })
    },
    delManyList: async ({ username, productFinallName }) => {
       
        let arr = []
        productFinallName.forEach(element => {
            arr.push(element.productFinallName)
        });

        return ordersModel.deleteMany({
            username,
            productFinallName: {
                $in: arr
            }
        })
       
    },
    forOrdersDel: async ({username,productFinallName}) => {
        return ordersModel.deleteMany({
            username,
            productFinallName: {
                $in: productFinallName
            }
        })
    }


}

module.exports = ordersService