var express = require('express');
var router = express.Router();
var mysql = require("mysql");
var oneDirection = require("../config/oneDirection.json");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('feedback', { title: 'feedback' });
});
router.get('/addC', function(req, res, next) {
  res.render('addFeedback');
});

router.get('/addFeedback', function (req, res, next) {
  var content = req.query.content;
  var tel = req.query.tel;
  var time = req.query.time;
  console.log(content,tel,time);
  var con = mysql.createConnection(oneDirection);
  con.connect();//连接上
  con.query("insert into feedback(content, tel, time) values(?,?,?)", [content, tel, time], function (err, result) {
    if (err) {
      res.send({ok:false,msg:'反馈失败！'});
    } else {
      res.send({ok:true,msg:'反馈成功！'});
    }
  });//操作数据库的语句   不会直接把数据拼接到sql里面
  con.end();
});

router.get('/list',function(req,res,next){
  var con = mysql.createConnection(oneDirection);
  con.connect();
  con.query("select * from feedback",function(err,result){
    if(err){
      console.log(err);
    }else{
      // res.send({feedbackList:result});
      res.render('feedback',{feedbackList:result});
    }
  });//查询操作
  con.end();
})

router.get('/deleteFeedback', function (req, res, next) {
  var con = mysql.createConnection(oneDirection);
  con.connect();
  var tel = req.query.tel;
  var time = req.query.time;
  var reg = /%20/;
  time = time.replace(reg,' ');
  console.log(time);
  con.query("delete from feedback where tel=? and time=?",[tel,time],function(err,result){
    if(err){
      res.send({ok:false,msg:"删除失败！"});
    }else{
      console.log(result);
      res.send({ok:true,msg:"删除成功！"});
    }
  });
  con.end();
});

module.exports = router;
