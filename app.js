var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const userRouter = require('./routes/admin/UserRouter');
const starRouter = require('./routes/admin/StarRouter');
const addressRouter = require('./routes/admin/addressRouter');
const ordersRouter = require('./routes/admin/ordersRouter');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const JWT = require('./util/JWT');
const cors = require('cors');
const payRouter = require('./routes/admin/PayRouter');
var app = express();







app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//全局token校验
app.use((req, res, next) => {
  //如果token有效,next()
  if (req.url == '/adminapi/user/login' || req.url == '/adminapi/user/register' || req.url == '/adminapi/user/sendsms' || req.url == '/adminapi/user/changepassword') {
    next()
    return
  }

  // console.log(req);

  const token = req.headers['authorization'].split(" ")[1]
  // console.log(token);
  if (token) {
    let playload = JWT.verify(token)

    // console.log('是否有效==>',playload);
    //如果当前用户在有效期内重复访问，更新token
    if (playload) {
      const newToken = JWT.generate({
        _id: playload._id,
        username: playload.username
      }, '1d')
      res.header('Authorization', newToken)
      next()
    }
    else {
      //如果token过期或用户长时间没有登陆,返回401
      res.status(401).send({
        code: "-1",
        error: 'token过期'
      })
    }


  }



})

app.use(userRouter)
app.use(starRouter)
app.use(addressRouter)
app.use(ordersRouter)

app.use(payRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
