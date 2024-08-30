var express = require('express');
var payRouter = express.Router();
const payController = require('../../controllers/admin/PayController')
payRouter.post('/adminapi/orders/submitOrder',payController.submitOrder)
payRouter.get('/adminapi/orders/getOrders/:oid',payController.getOrdesr)
payRouter.post('/adminapi/orders/pay',payController.pay)
payRouter.post('/adminapi/orders/payment',payController.payment)

payRouter.post('/adminapi/orders/successPayment',payController.successPay)


//不同状态的订单
payRouter.get('/adminapi/orders/getDifOrder/:id',payController.getDifOrder)
payRouter.post('/adminapi/orders/delOrders/:id',payController.delOrders)
payRouter.post('/adminapi/orders/changeOrdersState/:id',payController.changeStatus)
module.exports = payRouter