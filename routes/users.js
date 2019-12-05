var express = require('express');
var router = express.Router();
var { checkToken } = require('../config/token');
const pg = require('pg');
var con = new pg.Client({
  user: 'postgres',
  password: 'duxiu2017!',
  port: 5432,
  database: 'xinsheng',
  host: '139.155.44.190'
});
//处理error事件，如果出错则退出
con.on('error', err => {
  console.log(err);
  process.exit(1);
});

con.connect();
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('usersLogin', { title: '用户登录' });
});

router.get('/addUsers', function (req, res, next) {
  res.render('usersPost', { title: '用户注册' });
});

router.get('/change1', function (req, res, next) {
  res.render('change', { title: '完善资料' });
});

router.get('/addUser', function (req, res, next) {
  var name = req.query.name;
  var tel = req.query.tel;
  var college = null;
  var sex = null;
  var pwd = req.query.pwd;
  var con = mysql.createConnection(oneDirection);//dbconfig就是dbconfig里面的对象
  con.connect();//连接上
  con.query("insert into users(name, tel, college, sex, pwd) values(?,?,?,?,?)", [name, tel, college, sex, pwd], function (err, result) {
    if (err) {
      res.send({ ok: false, msg: '注册失败！' });
    } else {
      res.send({ ok: true, msg: '注册成功！' });
    }
  });//操作数据库的语句   不会直接把数据拼接到sql里面
});

router.get('/change', async (req, res, next)=> {
  try {
      var college = req.query.college;
      var sex = req.query.sex;
      var name = req.query.name;
      let sql = 'update users set college=$1,sex=$2 where name=$3';
      let r1 = await con.query(sql, [college, sex, name]);
      console.log(r1.rows);
      res.send({ ok: true, msg: '修改成功！' });
    // })
  } catch (err) {
    res.send({ ok: false, msg: '修改失败！' });
  }
});


router.get('/list', async (req, res, next) => {
  try {
    let sql = 'select * from users';
    let r = await con.query(sql, []);
    res.send({ usersList: r.rows });
  } catch (err) {
    console.log(err);
  }
})

router.get('/login', async (req, res, next)=> {
  try {
    let sql = 'select pwd from users WHERE name=$1';
    let r = await con.query(sql, [req.query.name]);
    var message = JSON.stringify(r.rows);
    message = JSON.parse(message);
    console.log(r.rows);
    if (!message.length) {
      res.send({ ok: false, msg: '此用户不存在！' });
    }
    else if (message[0].pwd == req.query.pwd) {
      res.send({ ok: true, msg: '登陆成功！' });
    }
    else {
      res.send({ ok: false, msg: '密码错误！' });
    }
  } catch (err) {
    res.send({ ok: false, msg: '此用户不存在！' });
  }
});


module.exports = router;
