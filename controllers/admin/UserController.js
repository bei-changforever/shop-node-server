const userService = require('../../services/admin/UserService')
const JWT = require('../../util/JWT')
const userController = {
    login: async (req, res) => {

        let result = await userService.login(req.body)
        if (result.length == 0) {
            res.send({
                code: "-1",
                error: '用户名密码不匹配'
            })
        }
        else {


            const token = JWT.generate({
                _id: result[0].id,
                username: result[0].username
            }, '1d')

            res.header('Authorization', token)
            res.send({
                ActionType: "OK",
                message: '登录成功',
                data: {

                    username: result[0].username,
                    introduction: result[0].introduction,
                    avatar: result[0].avatar,
                }
            })
        }
    },
    upload: async (req, res) => {
        const { username, introduction } = req.body
        console.log(introduction);
        const token = req.headers['authorization'].split(" ")[1]
        let playload = JWT.verify(token)
        const avatar = req.file ? `/avataruploads/${req.file.filename}` : ''
        //调用service模块更新数据

        await userService.upload({
            _id: playload._id,
            username,
            introduction,
            avatar
        })

        if (avatar) {
            res.send({
                ActionType: "OK",
                data: {
                    username,
                    introduction,
                    avatar
                }
            })
        }
        else {
            res.send({
                ActionType: "OK",
                data: {
                    username,
                    introduction,
                }
            })
        }



    },
    register: async (req, res) => {
        const { username, password } = req.body
        let result = await userService.login(req.body)
        if (result.length == 0) {

            await userService.register({ username, password })

            res.send({
                ActionType: "OK",
                message: '注册成功',
                data: {
                    username,
                    password
                }
            })
        }
        else {
            res.send({
                code: 4000,
                message: '此用户已注册'
            })
        }
    },
    sendsms: async (req, res) => {
        let result = await userService.login(req.body)

        if (result.length == 0) {
            res.send({
                code: '-1',
                error: '此用户未注册'
            })
        }
        else {
            let sms = Math.floor(Math.random() * (9999 - 1000)) + 1000
            // await userService.changePassword
            res.send({
                code: 4000,
                data: {
                    sms
                }
            })
        }
    },
    changepassword: async (req, res) => {
        console.log(req.body);
        const { username, password } = req.body

        let result = await userService.login(req.body)
        if (result.length == 0) {
            res.send({
                code: '-1',
                data: {
                    message: '无此用户'
                }
            })
        }
        else {
            await userService.changePassword({ username, password })
            res.send({
                code: 4000,
                data: {
                    message: '修改成功'
                }
            })
        }

    }
}


module.exports = userController