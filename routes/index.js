const express = require('express');
const router = express.Router();



// 定义中间件判断登录状态
// router.use((request, response, next) => {
//     if (request.url == '/admin/login' || request.url == '/admin/doLogin') {
//         next();
//     } else {
//         if (request.session.userInfo && request.session.userInfo.username != '') {
//             request.app.locals['userInfo'] = request.session.userInfo;
//             next();
//         } else {
//             response.redirect('/admin/login');
//         }
//     }
// });

// 配置路由
router.get('/', (request,response) => {
    response.redirect('/admin/product');
});

module.exports = router;