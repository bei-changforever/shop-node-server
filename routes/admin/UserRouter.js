var express = require('express');
var userRouter = express.Router();
const userController = require('../../controllers/admin/UserController')
//图片上传
const multer = require('multer')
//要放到静态资源文件夹内
const upload = multer({
    dest: 'public/avataruploads/'
})

userRouter.post('/adminapi/user/login',userController.login)

userRouter.post('/adminapi/user/upload',upload.single('file'),userController.upload)

userRouter.post('/adminapi/user/register',userController.register)

userRouter.post('/adminapi/user/sendsms',userController.sendsms)

userRouter.post('/adminapi/user/changepassword',userController.changepassword)

module.exports = userRouter