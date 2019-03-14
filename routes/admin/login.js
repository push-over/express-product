const express = require('express'); // express 框架
const router = express.Router();
const bodyParser = require('body-parser'); // 获取数据
const mongo = require('../../modules/mongo'); // 数据库操作
const md5 = require('md5-node'); // md5加密

// 设置bodyParser中间件
router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json());

// 登录
router.get('/', (request, response) => {
    response.render('admin/login');
});

// 获取登录提交的数据
router.post('/doLogin', (request, response) => {
    //  1、获取数据
    var username = request.body.username;
    var password = md5(request.body.password);
    //  2、连接数据库查询数据
    mongo.find('user', {
        username: username,
        password: password
    }, (error, data) => {
        if (data.length > 0) {
            console.log('登录成功');
            request.session.userInfo = data[0];
            response.redirect('/admin/product');
        } else {
            response.send("<script>alert('登录失败');location.href='/admin/login';</script>");
        }
    });
});

// 退出登录
router.get('/logout', (request, response) => {
    // 销毁session
    request.session.destroy((error) => {
        if (error) {
            console.log(error);
        } else {
            response.redirect('/admin/login');
        }
    });
});

module.exports = router;