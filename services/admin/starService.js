
const starModel = require('../../models/StarModel')
const userModel = require('../../models/UserModel')
const starService = {

    finduser: async ({ _id, username }) => {
        return userModel.find({
            _id, username
        })
    },

    add: async ({ username, productId, title, keywords, price, star, imgsrc, isCheck }) => {


        return starModel.create({
            username, productId, title, keywords, price, star, imgsrc, isCheck
        })


    },


    delList: async ({ username, productId }) => {

    
        if (typeof productId == String) {
            return starModel.find({
                username
            }).deleteOne({
                productId
            })
        }

        else {
            return starModel.find({
                username
            }).deleteMany({
                productId: {
                    $in: productId
                }
            })
        }

    },

    //查询所有
    geAlltList: async (playload) => {

        return starModel.find({
            username: playload.username
        })
    },
    getOneList: async ({ username, productId }) => {
        return starModel.find({
            username,
            productId
        })
    },

}

module.exports = starService