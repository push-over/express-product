const express = require('express'); // express 框架
const session = require('express-session'); // session操作
const app = new express();

// 设置express-session中间件
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30
    },
    rolling: true
}))

// ejs模板引擎 默认找views这个目录
app.set('view engine', 'ejs');
app.use(express.static('assets'));
app.use('/assets/upload', express.static('assets/upload'));

// 引入模块
const admin = require('./routes/admin');
const index = require('./routes/index');

app.use('/admin', admin);
app.use('/', index);

app.listen(9999, '127.0.0.1');