var express = require('express');
var ordersRouter = express.Router();
const ordersController = require('../../controllers/admin/OrdersController')


ordersRouter.post('/adminapi/orders/add',ordersController.add)

ordersRouter.get('/adminapi/orders/getList',ordersController.getList)

ordersRouter.post('/adminapi/orders/getoneList',ordersController.chachong)

ordersRouter.post('/adminapi/orders/delList',ordersController.delList)

ordersRouter.post('/adminapi/orders/addCount',ordersController.addCount)

ordersRouter.post('/adminapi/orders/forOrdersDel',ordersController.forOrdersDel)

module.exports = ordersRouter