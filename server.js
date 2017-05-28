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
  var query = "select * FROM record";
  connection.query(query, function (err, dbres) {
    res.send(dbres);
  });
})
//console.log(err+'***'+dbres);

//签到
app.get('/record', function (req, res) {
  var name = url.parse(req.url, true).query.name;
  console.log("name:" + name);
  var query = "UPDATE record SET flag=1 WHERE name = ?";
  connection.query(query, [name], function (err, dbres) {
    res.send(dbres);
  });
})
app.get('/getRecordNum', function (req, res) {
  var query = "select count(*) FROM record WHERE flag = 1";
  connection.query(query, function (err, dbres) {
    res.send(dbres);
  });
})


/**
 * 权限表相关
 */
//添加
app.get('/addUser', function (req, res) {
  var name = url.parse(req.url, true).query.name;
  var password = url.parse(req.url, true).query.password;
  var city1 = url.parse(req.url, true).query.city1;
  var city2 = url.parse(req.url, true).query.city2;
  var city3 = url.parse(req.url, true).query.city3;
  var data1 = {
    name: name,
    password: password,
    city1: city1,
    city2: city2,
    city3: city3
  };
  var query = "INSERT INTO user SET ?";
  connection.query(query, data1, function (err, dbres) {
    res.json(dbres);
  });
})
//更新
app.get('/updateUser', function (req, res) {
  var name = url.parse(req.url, true).query.name;
  var password = url.parse(req.url, true).query.password;
  var city1 = url.parse(req.url, true).query.city1;
  var city2 = url.parse(req.url, true).query.city2;
  var city3 = url.parse(req.url, true).query.city3;
  var query = "UPDATE user SET password=?,city1=?,city2=?,city3=? WHERE name = ?";
  connection.query(query, [password,city1,city2,city3,name], function (err, dbres) {
    // console.log(err);
    // console.log(JSON.stringify(dbres));
    res.json(dbres);
  });
})
//根据name获取user
app.get('/getUserByName', function (req, res) {
  var pk = url.parse(req.url, true).query.pk;
  var query = "SELECT * FROM user WHERE name = ?";
  connection.query(query, [pk], function (err, dbres) {
    res.json(dbres);
  });
})
//删除
app.get('/deleteUser', function (req, res) {
  var pk = url.parse(req.url, true).query.pk;
  var query = "DELETE FROM user WHERE name = ?";
  connection.query(query, [pk], function (err, dbres) {
    res.json(dbres);
  });
})
//获取数据
app.get('/getUserTable', function (req, res) {
  var query = "SELECT * FROM user";
  connection.query(query, function (err, dbres) {
    res.send(dbres);
  });
})
//登陆
app.get('/login', function (req, res) {
  var name = url.parse(req.url, true).query.name;
  var passWord = url.parse(req.url, true).query.passWord;
  var query = "SELECT * FROM user WHERE name = ?";
  connection.query(query, [name], function (err, dbres) {
    //res.send(err+'***'+dbres);
    if(dbres=='')
      res.send({"ok":-1});
    else if(dbres[0].password == passWord)
      res.send(dbres[0]);
    else
      res.send({"ok":0});
  });
})
//修改密码
app.get('/modifyPassword', function (req, res) {
  var name = url.parse(req.url, true).query.name;
  var passWord = url.parse(req.url, true).query.passWord;
  console.log(passWord);
  var query = "UPDATE user SET password=? WHERE name = ?";
  connection.query(query, [passWord,name], function (err, dbres) {
    res.json(dbres);
  });
})

/**
 * 户主表相关
 */
//根据id获取用户
app.get('/getPeopleByID', function (req, res) {
  var id = url.parse(req.url, true).query.id;
  var query = "SELECT name FROM people where id = ?";
  connection.query(query, [id], function (err, dbres) {
    res.json(dbres);
  });
})
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
 * 表101相关
 */
//获取表101数据 
app.get('/getTable101', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  //console.log(city);
  var query = "SELECT * FROM table101 where city = ?";
  connection.query(query, [city], function (err, dbres) {
    //console.log(err+'***'+dbres);
    res.json(dbres);
  });
})
//更新表101
//unit a1 a2 a3 a4 autoID
app.get('/updateTable101', function (req, res) {
  var unit = url.parse(req.url, true).query.unit;
  var a1 = url.parse(req.url, true).query.a1;
  var a2 = url.parse(req.url, true).query.a2;
  var a3 = url.parse(req.url, true).query.a3;
  var a4 = url.parse(req.url, true).query.a4;
  var b1 = url.parse(req.url, true).query.b1;
  var b2 = url.parse(req.url, true).query.b2;
  var b3 = url.parse(req.url, true).query.b3;
  var b4 = url.parse(req.url, true).query.b4;
  var autoID = url.parse(req.url, true).query.autoID;
  var query = "UPDATE table101 SET unit=?,a1=?,a2=?,a3=?,a4=?,b1=?,b2=?,b3=?,b4=? WHERE autoID = ?";
  connection.query(query, [unit, a1, a2, a3, a4, b1, b2, b3, b4, autoID], function (err, dbres) {
    res.json(dbres);
  });
})


/**
 * 表9相关
 */
//获取表9数据第一行数据 
app.get('/getTable9L1', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var query = "SELECT sum(a1),sum(a2),sum(a3),sum(a4),sum(a1*price),sum(a2*price),sum(a3*price),sum(a4*price) FROM table91 where index1 < 8 and city LIKE  '" + city + "%'";
  connection.query(query, function (err, dbres) {
    res.json(dbres);
  });
})
//获取表9数据第二行
app.get('/getTable9L2', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var query = "SELECT sum(a1),sum(a2),sum(a3),sum(a4),sum(a1*price),sum(a2*price),sum(a3*price),sum(a4*price) FROM table93 where index1 < 7 and city LIKE  '" + city + "%'";
  connection.query(query, function (err, dbres) {
    res.json(dbres);
  });
})
//获取表9数据4
app.get('/getTable9L4', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var query = "SELECT sum(a1),sum(a2),sum(a3),sum(a4),sum(a1*price),sum(a2*price),sum(a3*price),sum(a4*price) FROM table93 where index1 in (8,9) and city LIKE  '" + city + "%'";
  connection.query(query, function (err, dbres) {
    res.json(dbres);
  });
})
//获取表9数据3-1
app.get('/getTable9L31', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var query = "SELECT sum(a1),sum(a2),sum(a3),sum(a4),sum(a1*price),sum(a2*price),sum(a3*price),sum(a4*price) FROM table91 where index1=8 and city LIKE  '" + city + "%'";
  connection.query(query, function (err, dbres) {
    res.json(dbres);
  });
})
//获取表9数据3-2
app.get('/getTable9L32', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var query = "SELECT sum(a1),sum(a2),sum(a3),sum(a4),sum(a1*price),sum(a2*price),sum(a3*price),sum(a4*price) FROM table93 where index1=7 and city LIKE  '" + city + "%'";
  connection.query(query, function (err, dbres) {
    res.json(dbres);
  });
})
/**
 * 表93相关
 */
//获取表93数据 
app.get('/getTable93', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var query = "SELECT * FROM table93 where city = ?";
  connection.query(query, [city], function (err, dbres) {
    res.json(dbres);
  });
})
//更新表93
//unit price a1 a2 a3 a4 autoID
app.get('/updateTable93', function (req, res) {
  var unit = url.parse(req.url, true).query.unit;
  var price = url.parse(req.url, true).query.price;
  var a1 = url.parse(req.url, true).query.a1;
  var a2 = url.parse(req.url, true).query.a2;
  var a3 = url.parse(req.url, true).query.a3;
  var a4 = url.parse(req.url, true).query.a4;
  var autoID = url.parse(req.url, true).query.autoID;
  var query = "UPDATE table93 SET unit=?,price=?,a1=?,a2=?,a3=?,a4=? WHERE autoID = ?";
  connection.query(query, [unit, price, a1, a2, a3, a4, autoID], function (err, dbres) {
    res.json(dbres);
  });
})
/**
 * 表92相关
 */
//获取表92数据 
app.get('/getTable92Sum', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  //console.log(city);
  var query = "SELECT index1,sum(a1),sum(a2),sum(a3),sum(a4) FROM table91 where city LIKE  '" + city + "%'"+"group by index1";
  connection.query(query, function (err, dbres) {
    //console.log(err+'***'+dbres);
    res.json(dbres);
  });
})
//获取表92数据 
app.get('/getTable92', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  //console.log(city);
  var query = "SELECT unit,price,index1 FROM table91 where city LIKE  '" + city + "%'";
  connection.query(query, function (err, dbres) {
    //console.log(err+'***'+dbres);
    res.json(dbres);
  });
})
/**
 * 表91相关
 */
//获取表91数据 
app.get('/getTable91', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var query = "SELECT * FROM table91 where city = ?";
  connection.query(query, [city], function (err, dbres) {
    res.json(dbres);
  });
})
//更新表91
//unit price a1 a2 a3 a4 autoID
app.get('/updateTable91', function (req, res) {
  var unit = url.parse(req.url, true).query.unit;
  var price = url.parse(req.url, true).query.price;
  var a1 = url.parse(req.url, true).query.a1;
  var a2 = url.parse(req.url, true).query.a2;
  var a3 = url.parse(req.url, true).query.a3;
  var a4 = url.parse(req.url, true).query.a4;
  var autoID = url.parse(req.url, true).query.autoID;
  var query = "UPDATE table91 SET unit=?,price=?,a1=?,a2=?,a3=?,a4=? WHERE autoID = ?";
  connection.query(query, [unit, price, a1, a2, a3, a4, autoID], function (err, dbres) {
    res.json(dbres);
  });
})

/**
 * 表7相关
 */
//获取表7数据 
app.get('/getTable7', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var query = "SELECT sum(a1),sum(b1),sum(f1),sum(m1),sum(a2),sum(b2),sum(f2),sum(m2) FROM table71 where city = ?";
  connection.query(query, [city], function (err, dbres) {
    res.json(dbres);
  });
})
/**
 * 表71相关
 */
//获取表71行数
app.get('/getTable71Count', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var query = "SELECT count(*) FROM table71 where city = ?";
  connection.query(query, [city], function (err, dbres) {
    res.json(dbres);
  });
})
//获取表71数据 
app.get('/getTable71', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var page = url.parse(req.url, true).query.page;
  var limit1 = 10 * (page-1);
  var query = "SELECT * FROM table71 where city = ? limit ?,10";
  connection.query(query, [city,limit1], function (err, dbres) {
    res.json(dbres);
  });
})
//获取表71数据 
app.get('/getTable71ByPK', function (req, res) {
  var id = url.parse(req.url, true).query.autoID;
  var query = "SELECT * FROM table71 where autoID = ?";
  connection.query(query, [id], function (err, dbres) {
    res.json(dbres);
  });
})
//添加表71
//c3 line a1 b1 f1 m1 a2 b2 f2 m2 city
app.get('/addTable71', function (req, res) {
  var c3 = url.parse(req.url, true).query.c3;
  var line = url.parse(req.url, true).query.line;
  var a1 = url.parse(req.url, true).query.a1;
  var b1 = url.parse(req.url, true).query.b1;
  var f1 = url.parse(req.url, true).query.f1;
  var m1 = url.parse(req.url, true).query.m1;
  var a2 = url.parse(req.url, true).query.a2;
  var b2 = url.parse(req.url, true).query.b2;
  var f2 = url.parse(req.url, true).query.f2;
  var m2 = url.parse(req.url, true).query.m2;
  var city = url.parse(req.url, true).query.city;
  var data1 = {
    c3: c3,
    line: line,
    a1: a1,
    b1: b1,
    f1: f1,
    m1: m1,
    a2: a2,
    b2: b2,
    f2: f2,
    m2: m2,
    city: city
  };
  var query = "INSERT INTO table71 SET ?";
  connection.query(query, data1, function (err, dbres) {
    res.json(dbres);
  });
})
//更新表71
app.get('/updateTable71', function (req, res) {
   var c3 = url.parse(req.url, true).query.c3;
  var line = url.parse(req.url, true).query.line;
  var a1 = url.parse(req.url, true).query.a1;
  var b1 = url.parse(req.url, true).query.b1;
  var f1 = url.parse(req.url, true).query.f1;
  var m1 = url.parse(req.url, true).query.m1;
  var a2 = url.parse(req.url, true).query.a2;
  var b2 = url.parse(req.url, true).query.b2;
  var f2 = url.parse(req.url, true).query.f2;
  var m2 = url.parse(req.url, true).query.m2;
  var autoID = url.parse(req.url, true).query.autoID;
  var data1 = {
    c3: c3,
    line: line,
    a1: a1,
    b1: b1,
    f1: f1,
    m1: m1,
    a2: a2,
    b2: b2,
    f2: f2,
    m2: m2
  };
  var query = "UPDATE table71 SET ? WHERE autoID = "+autoID;
  connection.query(query, data1, function (err, dbres) {
    res.json(dbres);
  });
})
//删除表71
app.get('/deleteTable71', function (req, res) {
  var pk = url.parse(req.url, true).query.autoID;
  var query = "DELETE FROM table71 WHERE autoID = ?";
  connection.query(query, [pk], function (err, dbres) {
    res.json(dbres);
  });
})

/**
 * 表5相关
 */
//获取表5行数
app.get('/getTable5Count', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var query = "SELECT count(*) FROM table5 where city = ?";
  connection.query(query, [city], function (err, dbres) {
    res.json(dbres);
  });
})
//获取表5数据 
app.get('/getTable5', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var page = url.parse(req.url, true).query.page;
  var limit1 = 10 * (page-1);
  var query = "SELECT * FROM table5 where city = ? limit ?,10";
  connection.query(query, [city,limit1], function (err, dbres) {
    res.json(dbres);
  });
})
//获取表5数据 
app.get('/getTable5ByPK', function (req, res) {
  var id = url.parse(req.url, true).query.autoID;
  var query = "SELECT * FROM table5 where autoID = ?";
  connection.query(query, [id], function (err, dbres) {
    res.json(dbres);
  });
})
//添加表5
// id name address area a1 a2 a3 a4 a5 doc city
app.get('/addTable5', function (req, res) {
  var name = url.parse(req.url, true).query.name;
  var id = url.parse(req.url, true).query.id;
  var address = url.parse(req.url, true).query.address;
  var area = url.parse(req.url, true).query.area;
  var a1 = url.parse(req.url, true).query.a1;
  var a2 = url.parse(req.url, true).query.a2;
  var a3 = url.parse(req.url, true).query.a3;
  var a4 = url.parse(req.url, true).query.a4;
  var a5 = url.parse(req.url, true).query.a5;
  var doc = url.parse(req.url, true).query.doc;
  var city = url.parse(req.url, true).query.city;
  var data1 = {
    name: name,
    id: id,
    address: address,
    area: area,
    a1: a1,
    a2: a2,
    a3: a3,
    a4: a4,
    a5: a5,
    doc: doc,
    city: city
  };
  var query = "INSERT INTO table5 SET ?";
  connection.query(query, data1, function (err, dbres) {
    res.json(dbres);
  });
})
//更新表5
app.get('/updateTable5', function (req, res) {
  var name = url.parse(req.url, true).query.name;
  var id = url.parse(req.url, true).query.id;
  var address = url.parse(req.url, true).query.address;
  var area = url.parse(req.url, true).query.area;
  var a1 = url.parse(req.url, true).query.a1;
  var a2 = url.parse(req.url, true).query.a2;
  var a3 = url.parse(req.url, true).query.a3;
  var a4 = url.parse(req.url, true).query.a4;
  var a5 = url.parse(req.url, true).query.a5;
  var doc = url.parse(req.url, true).query.doc;
  var autoID = url.parse(req.url, true).query.autoID;
  var data1 = {
    name: name,
    id: id,
    address: address,
    area: area,
    a1: a1,
    a2: a2,
    a3: a3,
    a4: a4,
    a5: a5,
    doc: doc
  };
  var query = "UPDATE table5 SET ? WHERE autoID = "+autoID;
  connection.query(query, data1, function (err, dbres) {
    res.json(dbres);
  });
})
//删除表5
app.get('/deleteTable5', function (req, res) {
  var pk = url.parse(req.url, true).query.autoID;
  var query = "DELETE FROM table5 WHERE autoID = ?";
  connection.query(query, [pk], function (err, dbres) {
    res.json(dbres);
  });
})


/**
 * 表4-3相关
 */
//获取表4-3行数
app.get('/getTable43Count', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var query = "SELECT count(*) FROM table43 where city = ?";
  connection.query(query, [city], function (err, dbres) {
    res.json(dbres);
  });
})
//获取表4-3数据 
app.get('/getTable43', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var page = url.parse(req.url, true).query.page;
  var limit1 = 10 * (page-1);
  var query = "SELECT * FROM table43 where city = ? limit ?,10";
  connection.query(query, [city,limit1], function (err, dbres) {
    res.json(dbres);
  });
})
//获取表4-3数据 
app.get('/getTable43ByPK', function (req, res) {
  var id = url.parse(req.url, true).query.autoID;
  var query = "SELECT * FROM table43 where autoID = ?";
  connection.query(query, [id], function (err, dbres) {
    res.json(dbres);
  });
})
//添加表4-3
//name id type unit quantity price total city
app.get('/addTable43', function (req, res) {
  var name = url.parse(req.url, true).query.name;
  var id = url.parse(req.url, true).query.id;
  var type = url.parse(req.url, true).query.type;
  var unit = url.parse(req.url, true).query.unit;
  var quantity = url.parse(req.url, true).query.quantity;
  var total = url.parse(req.url, true).query.total;
  var price = url.parse(req.url, true).query.price;
  var city = url.parse(req.url, true).query.city;
  var data1 = {
    name: name,
    id: id,
    type: type,
    unit: unit,
    quantity: quantity,
    total: total,
    price: price,
    city: city
  };
  var query = "INSERT INTO table43 SET ?";
  connection.query(query, data1, function (err, dbres) {
    res.json(dbres);
  });
})
//更新表4-3
app.get('/updateTable43', function (req, res) {
  var name = url.parse(req.url, true).query.name;
  var id = url.parse(req.url, true).query.id;
  var type = url.parse(req.url, true).query.type;
  var unit = url.parse(req.url, true).query.unit;
  var quantity = url.parse(req.url, true).query.quantity;
  var total = url.parse(req.url, true).query.total;
  var price = url.parse(req.url, true).query.price;
  var autoID = url.parse(req.url, true).query.autoID;
  var data1 = {
    name: name,
    id: id,
    type: type,
    unit: unit,
    quantity: quantity,
    total: total,
    price: price
  };
  var query = "UPDATE table43 SET name=?,id=?,type=?,unit=?,quantity=?,price=?,total=? WHERE autoID = "+autoID;
  connection.query(query, [name,id, type, unit, quantity, price, total], function (err, dbres) {
    res.json(dbres);
  });
})
//删除表4-3
app.get('/deleteTable43', function (req, res) {
  var pk = url.parse(req.url, true).query.autoID;
  var query = "DELETE FROM table43 WHERE autoID = ?";
  connection.query(query, [pk], function (err, dbres) {
    res.json(dbres);
  });
})


/**
 * 表4-1相关
 */
app.get('/getAllTable413Datas2', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var query = "SELECT * FROM table4 where city = ?";
  connection.query(query, [city], function (err, dbres) {
    res.json(dbres);
  });
})
//得到表412行数
app.get('/getTable412Count', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var query = "SELECT count(*) FROM table4 where city = ?";
  connection.query(query, [city], function (err, dbres) {
    res.json(dbres);
  });
})
//根据村名获取表412数据-无分页
app.get('/getAllTable412Datas2', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var query = "SELECT * FROM table4 where city = ?";
  connection.query(query, [city], function (err, dbres) {
    res.json(dbres);
  });
})
//根据村名获取表412数据 
app.get('/getAllTable412Datas', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var page = url.parse(req.url, true).query.page;
  var limit1 = 10 * (page-1);
  var query = "SELECT name,sum(area1),sum(area1*price+quantity*price2+o1+o2+o3+o4) FROM table4 where city = ? group by name limit ?,10";
  connection.query(query, [city,limit1], function (err, dbres) {
    res.json(dbres);
  });
})
//得到表411行数
app.get('/getTable411Count', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var query = "SELECT count(*) FROM table2 where city = ?";
  connection.query(query, [city], function (err, dbres) {
    res.json(dbres);
  });
})
//根据村名获取表411数据-无分页
app.get('/getAllTable411Datas2', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var query = "SELECT * FROM table2 where city = ?";
  connection.query(query, [city], function (err, dbres) {
    res.json(dbres);
  });
})
//根据id获取表411汇总数据
app.get('/getSumTable411Datas', function (req, res) {
  var ids = url.parse(req.url, true).query.ids;
  //console.log(ids);
  var query = "SELECT name,sum(quantity),sum(price*quantity) FROM table2 where id in ("+ids+") group by name";
  connection.query(query, function (err, dbres) {
    //console.log(err);
    res.json(dbres);
  });
})
//根据村名获取表411数据
app.get('/getAllTable411Datas', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var page = url.parse(req.url, true).query.page;
  var limit1 = 10 * (page-1);
  var query = "SELECT * FROM table2 where city = ? limit ?,10";
  connection.query(query, [city,limit1], function (err, dbres) {
    res.json(dbres);
  });
})

/**
 * 表四相关
 */
//更新表四价格
app.get('/updateTable4', function (req, res) {
  //'price', 'price2', 'o1', 'o2', 'o3', 'o4', 'pID'
  var price = url.parse(req.url, true).query.price;
  var price2 = url.parse(req.url, true).query.price2;
  var o1 = url.parse(req.url, true).query.o1;
  var o2 = url.parse(req.url, true).query.o2;
  var o3 = url.parse(req.url, true).query.o3;
  var o4 = url.parse(req.url, true).query.o4;
  var fid = url.parse(req.url, true).query.fID;
  var query = "UPDATE table4 SET price=?,price2=?,o1=?,o2=?,o3=?,o4=? WHERE fID = ?";
  connection.query(query, [price,price2,o1,o2,o3,o4,fid], function (err, dbres) {
    res.json(dbres);
  });
})
//根据主键获取表四数据 
app.get('/getTable4ByPK', function (req, res) {
  var pk = url.parse(req.url, true).query.pk;
  var query = "SELECT * FROM table4 where autoID = ?";
  connection.query(query, [pk], function (err, dbres) {
    res.json(dbres);
  });
})
//得到表四行数
app.get('/getTable4Count', function (req, res) {
  var id = url.parse(req.url, true).query.id;
  var query = "SELECT count(*) FROM table4 where id = ?";
  connection.query(query, [id], function (err, dbres) {
    res.json(dbres);
  });
})
//获取表四全部数据 
app.get('/gettable4AllDatas', function (req, res) {
  var id = url.parse(req.url, true).query.id;
  var query = "SELECT * FROM table4 where id = ?";
  connection.query(query, [id], function (err, dbres) {
    res.json(dbres);
  });
})
//获取表四数据 
app.get('/gettable4Datas', function (req, res) {
  var id = url.parse(req.url, true).query.id;
  var page = url.parse(req.url, true).query.page;
  var limit1 = 10 * (page-1);
  var query = "SELECT * FROM table4 where id = ? limit ?,10";
  connection.query(query, [id,limit1], function (err, dbres) {
    console.log(dbres);
    res.json(dbres);
  });
})
//根据prj得到表四price2
app.get('/getT4Price2ByPrj', function (req, res) {
  var prj = url.parse(req.url, true).query.prj;
  var query = "select price2 from table4 WHERE arcName = ?";
  connection.query(query, [prj], function (err, dbres) {
    res.json(dbres);
  });
})
//根据prj得到表四price
app.get('/getT4PriceByPrj', function (req, res) {
  var prj = url.parse(req.url, true).query.prj;
  var query = "select price from table4 WHERE type1 = ?";
  connection.query(query, [prj], function (err, dbres) {
    res.json(dbres);
  });
})
//删除表四
app.get('/deleteTable4', function (req, res) {
  var pk = url.parse(req.url, true).query.pk;
  var query = "DELETE FROM table4 WHERE fID = ?";
  connection.query(query, [pk], function (err, dbres) {
    res.json(dbres);
  });
})
//添加表四
app.get('/addTable4', function (req, res) {
  // id index type1 area1 t1 t2 t3 t4 t5 arcName unit quantity fID
  var id = url.parse(req.url, true).query.id;
  var index = url.parse(req.url, true).query.index;
  var area1 = url.parse(req.url, true).query.area1;
  var type1 = url.parse(req.url, true).query.type1;
  var t1 = url.parse(req.url, true).query.t1;
  var t2 = url.parse(req.url, true).query.t2;
  var t3 = url.parse(req.url, true).query.t3;
  var t4 = url.parse(req.url, true).query.t4;
  var t5 = url.parse(req.url, true).query.t5;
  var arcName = url.parse(req.url, true).query.arcName;
  var unit = url.parse(req.url, true).query.unit;
  var quantity = url.parse(req.url, true).query.quantity;
  var fID = url.parse(req.url, true).query.fID;
  var city = url.parse(req.url, true).query.city;
  var name = url.parse(req.url, true).query.name;
  var query = "INSERT INTO table4 SET ?";
  var data1 = {
    id: id,
    index: index,
    area1: area1,
    type1: type1,
    t1: t1,
    t2: t2,
    t3: t3,
    t4: t4,
    t5: t5,
    arcName: arcName,
    unit: unit,
    quantity: quantity,
    fID: fID,
    city: city,
    name: name
  };
  connection.query(query, data1, function (err, dbres) {
    res.json(dbres);
  });
})
//根据表三更新表四
app.get('/updateTable4ByT3', function (req, res) {
  // index type1 area1 t1 t2 t3 t4 t5 arcName unit quantity autoID
  var index = url.parse(req.url, true).query.index;
  var area1 = url.parse(req.url, true).query.area1;
  var type1 = url.parse(req.url, true).query.type1;
  var t1 = url.parse(req.url, true).query.t1;
  var t2 = url.parse(req.url, true).query.t2;
  var t3 = url.parse(req.url, true).query.t3;
  var t4 = url.parse(req.url, true).query.t4;
  var t5 = url.parse(req.url, true).query.t5;
  var arcName = url.parse(req.url, true).query.arcName;
  var unit = url.parse(req.url, true).query.unit;
  var quantity = url.parse(req.url, true).query.quantity;
  var fid = url.parse(req.url, true).query.autoID;
  var query = "UPDATE table4 SET table4.index=?,type1=?,area1=?,t1=?,t2=?,t3=?,t4=?,t5=?,arcName=?,unit=?,quantity=? WHERE fID = ?";
  connection.query(query, [index,type1,area1,t1,t2,t3,t4,t5,arcName,unit,quantity,fid], function (err, dbres) {
    //console.log(err);
    //console.log(dbres);
    res.json(dbres);
  });
})

/**
 * 表三相关
 */
//删除表三
app.get('/deleteTable2ByT1', function (req, res) {
  var pk = url.parse(req.url, true).query.pk;
  var query = "DELETE FROM table3 WHERE id = ?";
  connection.query(query, [pk], function (err, dbres) {
    res.json(dbres);
  });
})
//删除表三
app.get('/deleteTable3', function (req, res) {
  var pk = url.parse(req.url, true).query.pk;
  var query = "DELETE FROM table3 WHERE autoID = ?";
  connection.query(query, [pk], function (err, dbres) {
    res.json(dbres);
  });
})
//添加表三
app.get('/addTable3', function (req, res) {
  //index length width high area type1 type2 prj unit quantity id city
  var index = url.parse(req.url, true).query.index;
  var length = url.parse(req.url, true).query.length;
  var width = url.parse(req.url, true).query.width;
  var high = url.parse(req.url, true).query.high;
  var area = url.parse(req.url, true).query.area;
  var type1 = url.parse(req.url, true).query.type1;
  var type2 = url.parse(req.url, true).query.type2;
  var prj = url.parse(req.url, true).query.prj;
  var unit = url.parse(req.url, true).query.unit;
  var quantity = url.parse(req.url, true).query.quantity;
  var id = url.parse(req.url, true).query.id;
  var city = url.parse(req.url, true).query.city;
  var data1 = {
    index: index,
    length: length,
    width: width,
    high: high,
    area: area,
    type1: type1,
    type2: type2,
    prj: prj,
    unit: unit,
    quantity: quantity,
    id: id,
    city: city
  };
  var query = "INSERT INTO table3 SET ?";
  connection.query(query, data1, function (err, dbres) {
    res.json(dbres);
  });
})
//更新表三
app.get('/updateTable3', function (req, res) {
  //index length width high area type1 type2 prj unit quantity autoID 
  var index = url.parse(req.url, true).query.index;
  var length = url.parse(req.url, true).query.length;
  var width = url.parse(req.url, true).query.width;
  var high = url.parse(req.url, true).query.high;
  var area = url.parse(req.url, true).query.area;
  var type1 = url.parse(req.url, true).query.type1;
  var type2 = url.parse(req.url, true).query.type2;
  var prj = url.parse(req.url, true).query.prj;
  var unit = url.parse(req.url, true).query.unit;
  var quantity = url.parse(req.url, true).query.quantity;
  var autoID = url.parse(req.url, true).query.autoID;
  var data1 = {
    index: index,
    length: length,
    width: width,
    high: high,
    area: area,
    type1: type1,
    type2: type2,
    prj: prj,
    unit: unit,
    quantity: quantity,
    autoID: autoID
  };
  var query = "UPDATE table3 SET ? WHERE autoID = "+data1.autoID;
  connection.query(query, data1, function (err, dbres) {
    res.json(dbres);
  });
})
//根据主键获取表三数据 
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
//根据镇获取表三数据 
app.get('/getTable3Bycity3', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var query = "SELECT area,type2,prj,quantity,city FROM table3 where city LIKE  '" + city + "%'";
  connection.query(query, [city], function (err, dbres) {
    //console.log(err+'***'+dbres);
    res.json(dbres);
  });
})
//根据村子获取表三数据 
app.get('/getTable3Bycity', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var query = "SELECT area,type2,prj,quantity,city FROM table3 where city = ?";
  connection.query(query, [city], function (err, dbres) {
    res.json(dbres);
  });
})
//分页获取表三数据 
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
  var name = url.parse(req.url, true).query.name;
  var id = url.parse(req.url, true).query.id;
  var prj = url.parse(req.url, true).query.prj;
  var unit = url.parse(req.url, true).query.unit;
  var quantity = url.parse(req.url, true).query.quantity;
  var fID = url.parse(req.url, true).query.fID;
  var price = url.parse(req.url, true).query.price;
  var city = url.parse(req.url, true).query.city;
  var data1 = {
    name: name,
    id: id,
    prj: prj,
    unit: unit,
    quantity: quantity,
    fID: fID,
    price: price,
    city: city
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
//根据村子获取表一面积 
app.get('/getTable1SumArea', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var query = "SELECT sum(area) FROM table1 where city LIKE  '" + city + "%'";
  connection.query(query, [city], function (err, dbres) {
    //console.log(err+'***'+dbres);
    res.json(dbres);
  });
})
//根据村子获取表一面积 
app.get('/getTable1Area', function (req, res) {
  var city = url.parse(req.url, true).query.city;
  var query = "SELECT area FROM table1 where city = ?";
  connection.query(query, [city], function (err, dbres) {
    res.json(dbres);
  });
})
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
  var query = "INSERT INTO table1 SET ?";
  connection.query(query, data1, function (err, dbres) {
    //console.log(err+'###'+dbres);
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
  var city = url.parse(req.url, true).query.city;
  var query = "SELECT count(*) FROM table1 where city = ?";
  connection.query(query, [city], function (err, dbres) {
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
