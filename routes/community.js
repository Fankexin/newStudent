var express = require('express');
// var expressWs = require('express-ws');
var router = express.Router();
var mysql = require("mysql");
var oneDirection = require("../config/oneDirection.json");
var { checkToken } = require('../config/token');
// expressWs(router);

/* GET users listing. */

// router.ws('/', function (ws, req){
//     ws.send('你连接成功了')
//     ws.on('message', function (msg) {
//         // 业务代码

//     })
// });

router.get('/', function (req, res, next) {
  res.render('addCommunity', { title: 'community' });
});

router.get('/addCommunity', function (req, res, next) {
  var con = mysql.createConnection(usersconfig);//dbconfig就是dbconfig里面的对象
  con.connect();//连接上
  var data = req.query.data;
  checkToken(data, (r) => {
    var title = r.data.title;
    var content = r.data.content;
    var name = r.data.name;
    var clicks = r.data.name;
    var time = r.data.name;
    con.query("insert into community(title, content, name, clicks, time) values(?,?,?,?,?)", [title, content, name, clicks, time], function (err, result) {
      if (err) {
        res.send({ok:false,msg:'添加失败！'});
      } else {
        res.send({ok:true,msg:'添加成功！'});
      }
    });//操作数据库的语句   不会直接把数据拼接到sql里面
  })
  con.end();
});

router.get('/list', function (req, res, next) {
  var con = mysql.createConnection(oneDirection);
  con.connect();
  con.query("select * from community", function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.send({ communityList: result });
    }
  });//查询操作
  con.end();
})

router.get('/delUser', function (req, res, next) {
  var id = req.query.id;
  var con = mysql.createConnection(oneDirection);
  con.connect();
  con.query("delete from community where id=?", [id], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.send('selete success');
    }
  })
  con.end();
})

module.exports = router;
