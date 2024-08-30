var express = require('express');
var starRouter = express.Router();
const StarController = require('../../controllers/admin/StarController')

//涉及文件上传
starRouter.post('/adminapi/star/add',StarController.add)

starRouter.get('/adminapi/star/list',StarController.getAllList)

starRouter.get('/adminapi/star/list/:id',StarController.getOneList)

starRouter.delete('/adminapi/star/list/:id',StarController.delList)



module.exports = starRouter