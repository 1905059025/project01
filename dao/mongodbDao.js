//引入数据库模块
const MongoClient = require("mongodb").MongoClient;

//封装链接数据库的函数
function connDB(callback){
    const url = "mongodb://127.0.0.1:27017/project01";
    MongoClient.connect(url,(err,db)=>{
        if(err){
            callback(err,null);
            return;
        }
        callback(err,db)
    })
}

//显示数据
let showData = function(collectionName,json,callback){
    //创建数组用来存放最后结果的数据
    const result = [];
    connDB((err,db)=>{
        const cursor = db.collection(collectionName).find(json);
        cursor.each((err,document)=>{
            if(err){
                callback(err,null);
                db.close();
                return;
            }
            if(document != null){
                result.push(document)
            }else{
                callback(null,result)
                db.close();
            }
        })
    })
}

//添加数据
let addData = function(collectionName,json,callback){
    connDB((err,db)=>{
        db.collection(collectionName).insert(json,(err,result)=>{
            console.log("数据添加成功","dao42");
            callback(err,result);
            db.close();
        })
    })
}
//删除数据
let deleteData = function(collectionName,json,callback){
    connDB((err,db)=>{
        db.collection(collectionName).deleteOne(json,(err,result)=>{
            console.log("数据删除成功","dao51");
            callback(err,result);
            db.close()
        })
    })
}
//导出函数
exports.showData = showData;
exports.addData = addData;
exports.deleteData = deleteData;