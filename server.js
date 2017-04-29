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
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get('/test', function (req, res) {
  var name = url.parse(req.url, true).query.name;
  console.log("name:" + name);
  var query = "select * FROM table2";
  connection.query(query, function (err, dbres) {
    res.json(dbres);
  });
})

/**
 * 用户表相关
 */
//删除用户表
app.get('/deletePeopleTable', function (req, res) {
  var pk = url.parse(req.url, true).query.pk;
  var query = "DELETE FROM people WHERE id = ?";
  connection.query(query, [pk], function (err, dbres) {
    res.json(dbres);
  });
})
//过滤用户表
app.get('/getNameListByName', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var text = url.parse(req.url, true).query.text;
  var query = "SELECT * FROM people WHERE city = ? and name LIKE  '" + text + "%'";
  connection.query(query, [city], function (err, dbres) {
    res.json(dbres);
  });
})
//获取用户表
app.get('/getPeopleList', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var query = "SELECT * FROM people where city = ?";
  connection.query(query, [city], function (err, dbres) {
    res.json(dbres);
  });
})
//添加用户表
app.get('/addTablePeople', function (req, res) {
  var id = url.parse(req.url, true).query.id;
  var name = url.parse(req.url, true).query.name;
  var city = url.parse(req.url, true).query.city;
  var data1 = {
    id: id,
    name: name,
    city: city
  };
  var query = "INSERT INTO people SET ?";
  connection.query(query, data1, function (err, dbres) {
    res.json(dbres);
  });
})

/**
 * 表四相关
 */
//根据表三更新表四todo
app.get('/updateTable2ByT1', function (req, res) {
  // index type1 area1 t1 t2 t3 t4 t5 arcName unit quantity autoID
  var id = url.parse(req.url, true).query.id;
  var prj = url.parse(req.url, true).query.prj;
  var unit = url.parse(req.url, true).query.unit;
  var quantity = url.parse(req.url, true).query.quantity;
  var fid = url.parse(req.url, true).query.autoID;
  var query = "UPDATE table2 SET id = ?,prj=?,unit=?,quantity = ? WHERE fID = ?";
  connection.query(query, [id,prj,unit,quantity,fid], function (err, dbres) {
    res.json(dbres);
  });
})

/**
 * 表三相关
 */
//更新表三todo
app.get('/updateTable3', function (req, res) {
  //index length width high area type1 type2 prj unit quantity autoID 
  var name = url.parse(req.url, true).query.name;
  var family = url.parse(req.url, true).query.family;
  var people = url.parse(req.url, true).query.people;
  var rail = url.parse(req.url, true).query.rail;
  var type = url.parse(req.url, true).query.type;
  var area = url.parse(req.url, true).query.area;
  var land = url.parse(req.url, true).query.land;
  var nonland = url.parse(req.url, true).query.nonland;
  var prj = url.parse(req.url, true).query.prj;
  var unit = url.parse(req.url, true).query.unit;
  var quantity = url.parse(req.url, true).query.quantity;
  var autoID = url.parse(req.url, true).query.autoID;
  var data1 = {
    name: name,
    family: family,
    people: people,
    rail: rail,
    type: type,
    area: area,
    land: land,
    nonland: nonland,
    prj: prj,
    unit: unit,
    quantity: quantity,
    autoID: autoID
  };
  var query = "UPDATE table1 SET ? WHERE autoID = "+data1.autoID;
  connection.query(query, data1, function (err, dbres) {
    res.json(dbres);
  });
})
//根据主键获取表一数据 
app.get('/getTable3ByPK', function (req, res) {
  var pk = url.parse(req.url, true).query.pk;
  var query = "SELECT * FROM table3 where autoID = ?";
  connection.query(query, [pk], function (err, dbres) {
    res.json(dbres);
  });
})
//得到表三行数
app.get('/getTable3Count', function (req, res) {
  var id = url.parse(req.url, true).query.id;
  var query = "SELECT count(*) FROM table3 where id = ?";
  connection.query(query, [id], function (err, dbres) {
    res.json(dbres);
  });
})
//获取表三数据 
app.get('/gettable3Datas', function (req, res) {
  var id = url.parse(req.url, true).query.id;
  var page = url.parse(req.url, true).query.page;
  var limit1 = 10 * (page-1);
  var query = "SELECT * FROM table3 where id = ? limit ?,10";
  connection.query(query, [id,limit1], function (err, dbres) {
    res.json(dbres);
  });
})

/**
 * 表二相关
 */
//根据prj得到表二price
app.get('/getPriceByPrj', function (req, res) {
  var prj = url.parse(req.url, true).query.prj;
  var query = "select price from table2 WHERE prj = ?";
  connection.query(query, [prj], function (err, dbres) {
    res.json(dbres);
  });
})
//更改表二标准
app.get('/updateTable2', function (req, res) {
  var prj = url.parse(req.url, true).query.prj;
  var type = url.parse(req.url, true).query.type;
  var query = "UPDATE table2 SET price = ? WHERE prj = ?";
  connection.query(query, [type,prj], function (err, dbres) {
    res.json(dbres);
  });
})
//得到表二行数
app.get('/getTable2Count', function (req, res) {
  var id = url.parse(req.url, true).query.id;
  var query = "SELECT count(*) FROM table2 where id = ?";
  connection.query(query, [id], function (err, dbres) {
    res.json(dbres);
  });
})
//获取表二数据 
app.get('/gettable2Datas', function (req, res) {
  var id = url.parse(req.url, true).query.id;
  var page = url.parse(req.url, true).query.page;
  var limit1 = 10 * (page-1);
  var query = "SELECT * FROM table2 where id = ? limit ?,10";
  connection.query(query, [id,limit1], function (err, dbres) {
    res.json(dbres);
  });
})
//添加表二
app.get('/addTable2', function (req, res) {
  //id prj unit quantity fID price
  var id = url.parse(req.url, true).query.id;
  var prj = url.parse(req.url, true).query.prj;
  var unit = url.parse(req.url, true).query.unit;
  var quantity = url.parse(req.url, true).query.quantity;
  var fID = url.parse(req.url, true).query.fID;
  var price = url.parse(req.url, true).query.price;
  var data1 = {
    id: id,
    prj: prj,
    unit: unit,
    quantity: quantity,
    fID: fID,
    price: price
  };
  var query = "INSERT INTO table2 SET ?";
  connection.query(query, data1, function (err, dbres) {
    res.json(dbres);
  });
})
//根据表一更新表二
app.get('/updateTable2ByT1', function (req, res) {
  var id = url.parse(req.url, true).query.id;
  var prj = url.parse(req.url, true).query.prj;
  var unit = url.parse(req.url, true).query.unit;
  var quantity = url.parse(req.url, true).query.quantity;
  var fid = url.parse(req.url, true).query.autoID;
  var query = "UPDATE table2 SET id = ?,prj=?,unit=?,quantity = ? WHERE fID = ?";
  connection.query(query, [id,prj,unit,quantity,fid], function (err, dbres) {
    res.json(dbres);
  });
})
//删除表二
app.get('/deleteTable2', function (req, res) {
  var pk = url.parse(req.url, true).query.pk;
  var query = "DELETE FROM table2 WHERE fID = ?";
  connection.query(query, [pk], function (err, dbres) {
    res.json(dbres);
  });
})


/**
 * 表一相关
 */
//根据id获取表一数据 
app.get('/getTable1ById', function (req, res) {
  var id = url.parse(req.url, true).query.id;
  var query = "SELECT * FROM table1 where id = ?";
  connection.query(query, [id], function (err, dbres) {
    res.json(dbres);
  });
})
//添加表一
app.get('/addTable1', function (req, res) {
  //name id family people rail type area land nonland prj unit quantity city
  var name = url.parse(req.url, true).query.name;
  var id = url.parse(req.url, true).query.id;
  var family = url.parse(req.url, true).query.family;
  var people = url.parse(req.url, true).query.people;
  var rail = url.parse(req.url, true).query.rail;
  var type = url.parse(req.url, true).query.type;
  var area = url.parse(req.url, true).query.area;
  var land = url.parse(req.url, true).query.land;
  var nonland = url.parse(req.url, true).query.nonland;
  var prj = url.parse(req.url, true).query.prj;
  var unit = url.parse(req.url, true).query.unit;
  var quantity = url.parse(req.url, true).query.quantity;
  var city = url.parse(req.url, true).query.city;
  var data1 = {
    name: name,
    id: id,
    family: family,
    people: people,
    rail: rail,
    type: type,
    area: area,
    land: land,
    nonland: nonland,
    prj: prj,
    unit: unit,
    quantity: quantity,
    city: city
  };
  //console.log(data1);
  var query = "INSERT INTO table1 SET ?";
  connection.query(query, data1, function (err, dbres) {
    res.json(dbres);
  });
})
//更新表一
app.get('/updateTable1', function (req, res) {
  //name family people rail type area land nonland prj unit quantity
  var name = url.parse(req.url, true).query.name;
  var family = url.parse(req.url, true).query.family;
  var people = url.parse(req.url, true).query.people;
  var rail = url.parse(req.url, true).query.rail;
  var type = url.parse(req.url, true).query.type;
  var area = url.parse(req.url, true).query.area;
  var land = url.parse(req.url, true).query.land;
  var nonland = url.parse(req.url, true).query.nonland;
  var prj = url.parse(req.url, true).query.prj;
  var unit = url.parse(req.url, true).query.unit;
  var quantity = url.parse(req.url, true).query.quantity;
  var autoID = url.parse(req.url, true).query.autoID;
  var data1 = {
    name: name,
    family: family,
    people: people,
    rail: rail,
    type: type,
    area: area,
    land: land,
    nonland: nonland,
    prj: prj,
    unit: unit,
    quantity: quantity,
    autoID: autoID
  };
  var query = "UPDATE table1 SET ? WHERE autoID = "+data1.autoID;
  connection.query(query, data1, function (err, dbres) {
    res.json(dbres);
  });
})
//删除表一 
app.get('/deleteTable1', function (req, res) {
  var pk = url.parse(req.url, true).query.pk;
  var query = "DELETE FROM table1 WHERE autoID = ?";
  connection.query(query, [pk], function (err, dbres) {
    res.json(dbres);
  });
})
//根据主键获取表一数据 
app.get('/getTable1ByPK', function (req, res) {
  var pk = url.parse(req.url, true).query.pk;
  var query = "SELECT * FROM table1 where autoID = ?";
  connection.query(query, [pk], function (err, dbres) {
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
  var city = url.parse(req.url, true).query.city;
  var page = url.parse(req.url, true).query.page;
  var limit1 = 10 * (page - 1);
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
