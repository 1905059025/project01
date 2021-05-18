//引入所需模块
const http = require("http");
const fs = require("fs");
const url = require("url");
//为了使用数据库中的自带唯一id
const objectId = require("mongodb").ObjectId;
const dao = require("./dao/mongodbDao.js")


const server = http.createServer();
server.on("request",(req,res)=>{
    let urlObj = url.parse(req.url,true);
    //获取路由
    let pathname = urlObj.pathname;
    //获取参数
    let query = urlObj.query;

    //静态伺服
    if((pathname == "/page/index.html" || pathname == "/") && req.method == "GET"){
        fs.readFile("./page/index.html","utf8",(err,data)=>{
            if(err){
                fs.readFile("./page/404.html","utf8",(err,data)=>{
                    if(err){
                        return res.end("error");
                    }
                    res.writeHead(200,{'content-type':'text/html;charset=utf8'})
                    res.end(data);
                    return;
                })
            }
            res.writeHead(200,{'content-type':'text/html;charset=utf8'})
            res.end(data);
        })
    }else if(pathname == "/page/404.html" && req.method == "GET"){
        fs.readFile("./page/404.html","utf8",(err,data)=>{
            res.writeHead(200,{'content-type':'text/html;charset=utf8'})
            res.end(data);
        })
    }else if(pathname == "/js/01.js" && req.method == "GET"){
        fs.readFile("./js/01.js","utf8",(err,data)=>{
            res.writeHead(200,{'content-type':'text/javascript;charset=utf8'})
            res.end(data);
        })
    }else if(pathname == "/css/index.css" && req.method == "GET"){
        fs.readFile("./css/index.css","utf8",(err,data)=>{
            res.writeHead(200,{'content-type':'text/css;charset=utf8'})
            res.end(data);
        })
    }else if(pathname == "/css/reset.css" && req.method == "GET"){
        fs.readFile("./css/reset.css","utf8",(err,data)=>{
            res.writeHead(200,{'content-type':'text/css;charset=utf8'})
            res.end(data);
        })
    }else if(pathname == "/img/close.png" && req.method == "GET"){
        fs.readFile("./img/close.png","utf8",(err,data)=>{
            res.writeHead(200,{'content-type':'image/png;charset=utf8'})
            res.end(data);
        })
    }

    
    //接口编写
    //显示数据
    else if(pathname == "/showData" && req.method == "GET"){
        dao.showData("student",{},(err,result)=>{
            let newresult = null;
            if(err){
                res.end(newresult);
            }else{
                newresult = JSON.stringify(result);
                res.end(newresult)
            }
        })
    }

    //添加数据
    else if(pathname == "/addData" && req.method == "GET"){
        dao.addData("student",{
            "stuID":query.stuID,
            "stuName":query.stuName,
            "stuSex":query.stuSex,
            "stuAge":query.stuAge,
            "stuBirth":query.stuBirth,
            "stuTel":query.stuTel
        },(err,result)=>{
            if(err){
                res.end("0");
                return;
            }else{
                res.end("1")
            }
        })
    }

    //删除数据
    else if(pathname == "/deleteData" && req.method == "GET"){
        dao.deleteData("student",{
            "_id":new objectId(query.delStuID)
        },(err,result)=>{
            if(err){
                res.end("0");
                return;
            }else{
                res.end("1")
            }
        })
    }
})

server.listen(3000)