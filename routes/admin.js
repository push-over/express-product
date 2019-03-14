const express = require('express');
const router = express.Router();

// 引入模块
const login = require('./admin/login');
const product = require('./admin/product');

// 定义中间件判断登录状态
router.use((request, response, next) => {
    if (request.url == '/login' || request.url == '/login/doLogin') {
        next();
    } else {
        if (request.session.userInfo && request.session.userInfo.username != '') {
            request.app.locals['userInfo'] = request.session.userInfo;
            next();
        } else {
            response.redirect('/admin/login');
        }
    }
});

// 配置路由
router.use('/login', login);
router.use('/product', product);

module.exports = router;