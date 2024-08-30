
const userModel = require('../../models/UserModel')

const userService = {
    login: async ({ username, password }) => {
        return userModel.find({
            username,
        })
    },
    upload: async ({ _id, username, introduction, avatar }) => {

        if (avatar) {
            return userModel.updateOne({
                _id
            },
                {
                    username,
                    introduction,
                    avatar
                })
        }
        else {
            return userModel.updateOne({
                _id
            },
                {
                    username,
                    introduction,

                })
        }
    },
    register: async ({ username, password }) => {
        return userModel.create({
            username,
            password
        })
    },
    changePassword: async ({ username, password }) => {
        return userModel.updateOne({
            username
        },
            {
                password
            })
    }
}

module.exports = userService