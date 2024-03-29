var express = require('express');
var router = express.Router();
var url = require("url");
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
  res.render('addLearn');
});

router.get('/addLearn', async (req, res, next)=> {
  // var data = req.query.data;
  // checkToken(data, async (r) => {
    // console.log(r);
    try {
      let sql = 'insert into learn(title,content,name,time) values($1,$2,$3,$4)';
      let l = await con.query(sql, [req.query.title, req.query.content, req.query.name, req.query.time]);
      console.log(l.rows);
      res.send({ ok: true, msg: "发布成功" });
    } catch (err) {
      res.send({ ok: false, msg: "发布失败" });
    }
  // })

});

router.get('/deleteLearn', async (req, res, next) =>{
  try {
    var time = req.query.time;
    var reg = /%20/;
    time = time.replace(reg, ' ');
    let parsedUrl = url.parse(req.url, true);
    let name = parsedUrl.query.name;
    let sql = 'delete from learn where time=$1 and name=$2';
    let r = await con.query(sql, [time, name]);
    console.log(r.rows);
    res.send({ ok: true, msg: "删除成功" });
  } catch (err) {
    res.send({ ok: false, msg: "删除失败" });
  }
});

router.get('/list', async (req, res, next)=> {
  try {
    let sql = 'select * from learn';
    let r = await con.query(sql, []);
    console.log(r.rows);
    res.render('learn', { learnList: r.rows });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
