const JWT = require('../../util/JWT');
const payService = require('../../services/admin/PayService');
const ordersService = require('../../services/admin/OrdersService');
const alipaySdk = require('../../services/web/alipay');
const AlipayFormData = require('alipay-sdk/lib/form').default;
const axios = require('axios');
const payController = {
    //生成订单
    submitOrder: async (req, res) => {
        const token = req.headers['authorization'].split(" ")[1]
        const { username } = JWT.verify(token)

        //生成订单号
        function setTimeDateFmt(s) {  // 个位数补齐十位数
            return s < 10 ? '0' + s : s;
        }

        function createordernum() {
            const now = new Date()
            let month = now.getMonth() + 1
            let day = now.getDate()
            let hour = now.getHours()
            let minutes = now.getMinutes()
            let seconds = now.getSeconds()
            month = setTimeDateFmt(month)
            day = setTimeDateFmt(day)
            hour = setTimeDateFmt(hour)
            minutes = setTimeDateFmt(minutes)
            seconds = setTimeDateFmt(seconds)
            let orderCode = now.getFullYear().toString() + month.toString() + day + hour + minutes + seconds + (Math.round(Math.random() * 1000000)).toString();
            return orderCode;
            //基于年月日时分秒+随机数生成订单编号
        }

        // 未支付： 1
        // 待支付： 2
        // 支付成功： 3
        // 支付失败： 4
        let goodsArr = req.body
        //商品列表
        let goodsName = []
        //订单商品总金额
        let goodsPrice = 0
        //订单商品总数量
        let goodsNum = 0



        goodsArr.forEach(v => {
            // console.log(v.price);

            goodsName.push({
                productFinallName: v.productFinallName,
                goodsImg: v.productImgSrc,
                count: v.count,
                productId: v.productId,
                price: Number(v.price).toFixed(2)
            })



            goodsPrice += Number(v.price)

            goodsNum += Number(v.count)

        });


        let order_id = createordernum()

        await payService.submitOrders({
            username,
            goodsName,
            goodsPrice,
            goodsNum,
            order_status: 1,
            order_id
        })




        res.send({
            code: 4000,
            order_id
        })



    },
    getOrdesr: async (req, res) => {
        const token = req.headers['authorization'].split(" ")[1]
        const { username } = JWT.verify(token)
        let order_id = req.params.oid


        let result = await payService.getCurrentOrder({
            username,
            order_id
        })


        if (result) {
            res.send({
                code: 4000,
                message: '查询订单成功',
                data: result
            })
        }
        else {
            res.send({
                code: '-1',
                message: '查询订单失败',

            })
        }


    },
    pay: async (req, res) => {
        // console.log(req.body);

        const token = req.headers['authorization'].split(" ")[1]
        const { username } = JWT.verify(token)
        const { order_id, shopArr } = req.body
        let result = await payService.getCurrentOrder({
            username,
            order_id
        })

        if (result) {
            await payService.pay({
                username,
                order_id,
                order_status: 2
            })

            let productFinallName = []
            shopArr.goodsName.forEach(item => {
                productFinallName.push(item.productFinallName)
            })



            await ordersService.forOrdersDel({
                username,
                productFinallName
            })


        }
        res.send({
            code: 4000,
            message: '成功'
        })
    },
    //发起支付
    payment: (req, res) => {



        let order_id = req.body.order_id

        let price = req.body.price

        let name = req.body.name



        // //对接支付宝api

        const formData = new AlipayFormData();
        // //调用 setMethod并传入 get,会返回可以跳转到支付页面的url
        formData.setMethod('get');
        //支付时信息
        formData.addField('bizContent', {
            outTradeNo: order_id,//订单号
            productCode: 'FAST_INSTANT_TRADE_PAY', //写死的
            totalAmount: price, //价格
            subject: name,//商品名称
        });
        //支付成功或者失败跳转连接
        formData.addField('returnUrl', 'http://localhost:8080/payment');
        //返回promise
        const result = alipaySdk.exec(
            'alipay.trade.page.pay',
            {},
            { formData: formData },
            //对接支付宝成功，支付宝返回的数据
        );
        result.then(resp => {
            res.send({
                code: 4000,
                success: true,
                message: '支付中',
                paymentUrl: resp
            })
        });
    },
    successPay: (req, res) => {
        const token = req.headers['authorization'].split(" ")[1]
        const { username } = JWT.verify(token)
        let out_trade_no = req.body.out_trade_no
        let trade_no = req.body.trade_no

        let order_id = out_trade_no
        //支付宝配置
        const formData = new AlipayFormData();
        formData.setMethod('get');
        //支付时信息
        formData.addField('bizContent', {
            out_trade_no,
            trade_no
        });
        const result = alipaySdk.exec(
            'alipay.trade.query',
            {},
            { formData: formData },
            //对接支付宝成功，支付宝返回的数据
        );
        //后端请求支付宝
        result.then(resData => {
            axios({
                url: resData,
                method: 'GET'
            }).then(data => {
                let responseCode = data.data.alipay_trade_query_response;
                if (responseCode.code === '10000') {
                    switch (responseCode.trade_status) {
                        case 'WAIT_BUYER_PAY':
                            res.send({
                                code: 0,
                                data: {
                                    msg: '支付有交易记录，没付款'
                                }
                            })
                            break;
                        case 'TRADE_FINISHED':

                            payService.changePayStatus({
                                username,
                                order_id,
                                order_status: 3
                            })
                            res.send({
                                code: 2,
                                data: {
                                    msg: '交易结束，不可退款'
                                }
                            })
                            break;
                        case 'TRADE_SUCCESS':


                            payService.changePayStatus({
                                username,
                                order_id,
                                order_status: 3
                            })


                            res.send({
                                code: 2,
                                data: {
                                    msg: '交易完成'
                                }
                            })
                            break;
                        case 'TRADE_CLOSED':
                            res.send({
                                code: 1,
                                data: {
                                    msg: '交易关闭'
                                }
                            })
                            break;

                    }
                }
                else if (responseCode.code === '40004') {
                    res.send({
                        code: -1,
                        msg: '交易不存在'
                    })
                }
            }).catch(err => {
                res.send({
                    msg: '交易失败',
                    code: 500,
                    err
                })
            })
        });
    },
    getDifOrder: async (req, res) => {
        let order_status = req.params.id
        const token = req.headers['authorization'].split(" ")[1]
        const { username } = JWT.verify(token)
        let result = await payService.checkStatus({
            username,
            order_status
        })
        // console.log(result);

        if (result) {
            res.send({
                code: 2,
                data: result
            })
        }
        else {
            res.send({
                msg:'暂无'
            })
        }


    },
    delOrders: async (req,res) => {
        const token = req.headers['authorization'].split(" ")[1]
        const { username } = JWT.verify(token)
        let order_id = req.params.id

        await payService.delOrders({
            username,
            order_id
        })

        res.send({
            code: 2,
            msg:"删除订单成功"
        })
    },
    changeStatus: async (req,res) => {
        const token = req.headers['authorization'].split(" ")[1]
        const { username } = JWT.verify(token)
        let order_id = req.params.id
        await payService.changeStatus({
            username,
            order_id,
            order_status: 4
        })

        res.send({
            code: 2,
            msg:"收货成功"
        })

    }
}

module.exports = payController