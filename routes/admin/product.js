const express = require('express'); // express 框架
const router = express.Router();
const mongo = require('../../modules/mongo'); // 数据库操作
const multiparty = require('multiparty');
const fs = require('fs');

// 删除商品图片
const deleteProduct = ((_id) => {
    mongo.find('product', {
        "_id": new mongo.ObjectID(_id)
    }, (error, data) => {
        // 删除修改之前的图片
        fs.unlink(data[0].pic, (error) => {
            if (error) {
                console.log(error);
            }
        });

    });
});

// 商品列表
router.get('/', (request, response) => {
    // 查询数据库 把数据传给前台
    mongo.find('product', {}, (error, data) => {
        response.render('admin/product', {
            list: data
        });
    });
});

// 添加商品
router.get('/add', (request, response) => {
    response.render('admin/product/add');
});

router.post('/doAdd', (request, response) => {
    // 上传图片
    var form = new multiparty.Form();
    form.uploadDir = 'assets/upload';
    form.parse(request, function (err, fields, files) {
        // 获取表单值
        let title = fields.title[0];
        let price = fields.price[0];
        let fee = fields.fee[0];
        let description = fields.description[0];
        let pic = files.pic[0].path;

        // 添加到数据库
        mongo.insert('product', {
            title,
            price,
            fee,
            description,
            pic
        }, (error, data) => {
            if (!error) {
                response.redirect('/admin/product'); // 跳转到首页
            }
        });
    });
});


// 修改商品
router.get('/edit', (request, response) => {
    // 获取商品id
    let id = request.query.id;
    // 通过id查询数据库
    mongo.find('product', {
        "_id": new mongo.ObjectID(id)
    }, (error, data) => {
        response.render('admin/product/edit', {
            data: data[0]
        });

    });
});

router.post('/doEdit', (request, response) => {
    // 修改数据
    var form = new multiparty.Form();
    form.uploadDir = 'assets/upload';
    form.parse(request, function (err, fields, files) {
        // 获取表单值
        let _id = fields._id[0];
        let title = fields.title[0];
        let price = fields.price[0];
        let fee = fields.fee[0];
        let description = fields.description[0];
        let pic = files.pic[0].path;

        // 如果用户上传了图片 则修改
        if (files.pic[0].originalFilename) {
            deleteProduct(_id); // 删除之前的本地图片
            var productData = {
                title,
                price,
                fee,
                description,
                pic
            }

        } else { // 否则还是使用之前的图片
            var productData = {
                title,
                price,
                fee,
                description
            }

            // 删除本地临时产生的图片
            fs.unlink(pic, (error) => {
                if (error) {
                    console.log(error);
                }
            });
        }

        // 修改数据
        mongo.update('product', {
            "_id": new mongo.ObjectID(_id)
        }, productData, (error, data) => {
            if (!error) {
                response.redirect('/admin/product');
            }
        });
    });

});

// 删除商品
router.get('/delete', (request, response) => {
    // 获取商品id
    let id = request.query.id;
    // 删除这条id记录 并删除本地图片
    deleteProduct(id);
    mongo.delete('product', {
        "_id": new mongo.ObjectID(id)
    }, (error, data) => {
        if (!error) {
            response.redirect('/admin/product');
        }
    });
});
module.exports = router;