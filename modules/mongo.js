const MongoClient = require('mongodb').MongoClient; // 数据库操作
const assert = require('assert'); // 数据库操作
const ObjectID = require('mongodb').ObjectID;

// 数据库地址
const url = 'mongodb://localhost:27017/product';

// 连接数据库
function __connect(callback) {
    MongoClient.connect(url, {
        useNewUrlParser: true
    }, (error, db) => {
        if (error) {
            console.log('数据库连接失败');
            return;
        }
        callback(db);
    });
};

exports.ObjectID = ObjectID;

// 查询数据
exports.find = ((tableName, json, callback) => {
    __connect((db) => {
        const mydb = db.db('product');
        let result = mydb.collection(tableName).find(json);
        result.toArray((error, data) => {
            db.close();
            callback(error, data);
        })
    })
}); 

// 增加数据
exports.insert = ((tableName, json, callback) => {
    __connect((db) => {
        const mydb = db.db('product');
        mydb.collection(tableName).insertOne(json, (error, data) => {
            callback(error, data);
        });
    })
});

// 修改数据
exports.update = ((tableName, json1, json2, callback) => {
    __connect((db) => {
        const mydb = db.db('product');
        mydb.collection(tableName).updateOne(json1, {
            $set: json2
        }, (error, data) => {
            callback(error, data);
        });
    })
});

// 删除数据
exports.delete = ((tableName, json, callback) => {
    __connect((db) => {
        const mydb = db.db('product');
        mydb.collection(tableName).deleteOne(json, (error, data) => {
            callback(error, data);
        });
    })
});