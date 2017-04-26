var express = require('express');
var app = express();
var url = require('url');
//其它依赖
var fs = require("fs");
var mysql = require('mysql');
// Creates MySql database connection
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "143555",
  database: "db"
});
//app.use(express.static('image'));
//设置跨域访问
app.all('*', function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "X-Requested-With");
res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
res.header("X-Powered-By",' 3.2.1');
res.header("Content-Type", "application/json;charset=utf-8");
next();
});

app.get('/test', function (req, res) {
  var name=url.parse(req.url,true).query.name;
  console.log("name:"+name);
  var query = "select * FROM table2";
  connection.query(query, function (err, dbres) {
    res.json(dbres);
  });
})
//得到表1行数
app.get('/getTable1Count', function (req, res) {
  var query = "SELECT count(*) FROM table1";
  connection.query(query, function (err, dbres) {
    res.json(dbres);
  });
})
//得到表1数据
app.get('/getAllTable1Datas', function (req, res) {
  var city=url.parse(req.url,true).query.city;
  var page=url.parse(req.url,true).query.page;
  var limit1 = 10 * (page-1);
  var query = "SELECT * FROM table1 where city = ? limit ?,10";
  connection.query(query, [city, limit1], function (err, dbres) {
    res.json(dbres);
  });
})


var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
