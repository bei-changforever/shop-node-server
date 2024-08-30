
const ordersService = require('../../services/admin/OrdersService');
const JWT = require('../../util/JWT')
const ordersController = {
    add: async (req, res) => {


        const token = req.headers['authorization'].split(" ")[1]
        const { username } = JWT.verify(token)

        //判断当前为哪个用户
        const { skuOrigin, addressInfo, productFinallName, productId, buy_option } = req.body

        //先查，相同的商品Id且样式相同，则更新购物车数量

        let result = await ordersService.chachong({
            productFinallName,
            username,
            productId: skuOrigin.productId

        })
        if (result.length != 0) {
         
            let count = result.length
            result = result.slice(0, 1)
            result[0].skuOrigin.count = result[0].skuOrigin.count + count

            const { username, productId, skuOrigin, addressInfo, productFinallName, buy_option } = result[0]

            //删除匹配
            let acknowledged = await ordersService.delChong({
                productFinallName,
                username,
            })
            //创创建所需
            if (acknowledged) {

                await ordersService.add({
                    productFinallName,
                    username,
                    productId,
                    skuOrigin,
                    buy_option,
                    addressInfo,
                    isChoose: false,
                    editTime: new Date()
                })

                res.send({
                    code: 4000,
                    message: '查重去重创建成功',
                    shopCount: `当前商品类型的数量${result[0].skuOrigin.count}`
                })


            }
        }
        else {

            await ordersService.add({
                productFinallName,
                username,
                productId,
                skuOrigin,
                buy_option,
                addressInfo,
                isChoose: false,
                editTime: new Date()
            })

            res.send({
                code: 4000,
                message: '加入购物车成功'
            })

        }





        //然后，相同的商品id但样式不同，则更新购物车



        //没有的，更新购物车






    },
    getList: async (req, res) => {
        const token = req.headers['authorization'].split(" ")[1]
        const { username } = JWT.verify(token)

        let result = await ordersService.getList({
            username
        })

        if (result.length > 0) {
            res.send({
                code: 4000,
                message: '查询成功',
                data: result
            })
        }
        else {
            res.send({
                code: 4000,
                message: '暂无购物车数据',

            })
        }

    },
    getOneList: async (req, res) => {
        let productId = req.params.id
        const token = req.headers['authorization'].split(" ")[1]
        const { username } = JWT.verify(token)
        let result = await ordersService.getOneList({ username, productId })
        if (result.length > 0) {
            res.send({
                code: 4000,
                message: '查询单品成功',
                data: result
            })
        }
    },
    chachong: async (req, res) => {

        const token = req.headers['authorization'].split(" ")[1]
        const { username } = JWT.verify(token)
        const { productFinallName, productId } = req.body
        let result = await ordersService.chachong({
            username,
            productFinallName, productId
        })

        res.send({
            code: 4000,
            data: result
        })

    },
    delList: async (req, res) => {
        const token = req.headers['authorization'].split(" ")[1]
        const { username } = JWT.verify(token)
        if (req.body.length > 0) {

            await ordersService.delManyList({
                username,
                productFinallName: req.body
            })
        }
        if(!req.body.length) {
            const { productFinallName } = req.body
            await ordersService.delChong({
                username,
                productFinallName
            })
        }
        res.send('删除')
    },
    addCount: async (req,res) => {
        const token = req.headers['authorization'].split(" ")[1]
        const { username } = JWT.verify(token)

        const { skuOrigin,productFinallName } =req.body

        await ordersService.updateCount({
            username,
            productFinallName,
            skuOrigin
        })


        res.send('添加')


    },
    forOrdersDel: async(req,res) => {
   
        const token = req.headers['authorization'].split(" ")[1]
        const { username } = JWT.verify(token)
        let productFinallName = []

        req.body.forEach(i => {
            productFinallName.push(i.productFinallName)
        })

        await ordersService.forOrdersDel({
            username,
            productFinallName
        })

        res.send({
            code: 2,
           msg: '删除购物车数据'
        })
    }

    
}



module.exports = ordersController