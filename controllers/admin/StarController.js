
const starService = require('../../services/admin/starService')
const JWT = require('../../util/JWT')
const StarController = {

    add: async (req, res) => {
        // console.log(req.body);

        const token = req.headers['authorization'].split(" ")[1]

        let playload = JWT.verify(token)
        //判断当前为哪个用户
        let result = await starService.finduser(playload)

        if (result.length == 0) {
            res.status(401).send({
                code: "-1",
                message: '服务器错误'
            })
        }
        else {
            //调用service 增删改查
            const { productId, title, keywords, price, star, imgsrc, isCheck } = req.body
            await starService.add({
                _id: playload._id,
                username: playload.username,
                productId,
                title,
                keywords,
                price,
                star,
                imgsrc,
                isCheck
            })

            res.send({
                code: 4000,
                message: '收藏成功'
            })

        }
    },
    //查询所有
    getAllList: async (req, res) => {

        //判断当前为哪个用户

        const token = req.headers['authorization'].split(" ")[1]

        let playload = JWT.verify(token)

        let result = await starService.finduser(playload)

        if (result.length == 0) {
            res.status(401).send({
                code: "-1",
                message: '服务器错误'
            })
        }
        else {
            let listresult = await starService.geAlltList(playload)

            // console.log(listresult);

            res.send({
                code: 4000,
                data: listresult
            })
        }



    },
    getOneList: async (req, res) => {
        const token = req.headers['authorization'].split(" ")[1]
        let { username } = JWT.verify(token)
        let result = await starService.getOneList({
            username,
            productId: req.params.id
        })
        res.send({
            code: 4000,
            data: result
        })

    },
    delList: async (req, res) => {
        console.log('123123123123=>', req.params);
        const token = req.headers['authorization'].split(" ")[1]
        let { username } = JWT.verify(token)

        if (token) {

            let ids = req.params.id
            let manyId = []
            let oneId = 0
       

            if (ids.includes(",")) {
                manyId = ids.split(",")

                await starService.delList({
                    username,
                    productId: manyId
                })
                res.send({
                    code: 4000,
                    message: '取消收藏成功'
                })

            }
            else {
                oneId = ids
                await starService.delList({
                    username,
                    productId: oneId
                })
                res.send({
                    code: 4000,
                    message: '取消收藏成功'
                })


            }
     
        }


    },

}

module.exports = StarController