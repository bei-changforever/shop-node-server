var express = require('express');
var addressRouter = express.Router();
const addressController = require('../../controllers/admin/AddressController');

addressRouter.post('/adminapi/address/add',addressController.add)

addressRouter.get('/adminapi/address/list',addressController.getList)

addressRouter.delete('/adminapi/address/list:id',addressController.delAddress)

addressRouter.post('/adminapi/address/editList',addressController.editList)

module.exports = addressRouter