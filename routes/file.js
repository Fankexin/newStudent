var express = require('express');
var router = express.Router();
const url = require('url');
const path = require('path');

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

var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
/* 上传页面. */
router.get('/', function(req, res, next) {
 //res.render('.iews/index');
 res.render('addFile',{title:'上传文件'});
});
/* 上传 */
router.post('/addFile', function(req, res, next) {
  /* 生成multiparty对象，并配置上传目标路径 */
  var form = new multiparty.Form();
  /* 设置编辑 */
  form.encoding = 'utf-8';
  //设置文件存储路劲
  form.uploadDir = './public/files';
  //设置文件大小限制
  // form.maxFilesSize = 2 * 1024 * 1024;
  // form.maxFields = 1000;  //设置所有文件的大小总和
  //上传后处理
  form.parse(req, async(err, fields, files) =>{
    var filesTemp = JSON.stringify(files, null, 2);
    if(err) {
      console.log('parse error:' + err);
    }else {
      console.log('parse files:' + filesTemp);
      var inputFile = files.inputFile[0];
      var uploadedPath = inputFile.path;
      var dstPath = './public/files/' + inputFile.originalFilename;
      console.log('filespath='+uploadedPath);
      console.log('dstPath='+dstPath);
      console.log('filesTmp: ' + inputFile);
      console.log('Filename: ' + inputFile.originalFilename);
      //重命名为真实文件名
      // var path1 = inputFile.originalFilename.split('.');
      // var myDate = new Date();
      // path1[0]=path1[0]+myDate.toLocaleString();
      // var newPath = path1.join(".");
      // dstPath = './public/files/' + newPath;
      // dstPath =  dstPath.replace(/\s/g, "");
      // var reg = /:/g;
      // dstPath = dstPath.replace(reg,'-');
      // console.log('dstPath='+dstPath);

      fs.rename(uploadedPath, dstPath, function(err) {
        if(err) {
          console.log('rename error:' + err);
        }else {
          console.log('rename ok');
        }
      })
    }
    try {
      var type1 = inputFile.originalFilename.split('.');
      var type = type1[1];
      var myDate = new Date();
      var time1 = myDate.toLocaleDateString();
      var time2 = myDate.toLocaleTimeString();
      var reg = / /g;
      time2 = time2.replace(reg,'');
      var time = time1+' ' +time2;
      var name = '张三';
      // var name = req.body.name;
      console.log(inputFile.originalFilename,name,time,type);
      let sql = 'insert into file(filepath,name,time,type) values($1,$2,$3,$4)';
      let r = await con.query(sql, [inputFile.originalFilename,name,time,type]);
      console.log(r.rows);
    } catch (err) {
      console.log(err);
    }
    res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
    // res.json();
    res.write('received upload:\n\n');
    res.end(util.inspect({fields: fields, files: filesTemp}))
  })
})

router.get('/list', async (req, res, next)=> {
  try {
    let sql = 'select * from file';
    let r = await con.query(sql, []);
    console.log(r.rows);
    res.render('file', { fileList: r.rows });
  } catch (err) {
    console.log(err);
  }
});

router.get('/deleteFile', async (req, res, next) =>{
  try {
    let parsedUrl = url.parse(req.url, true);
    let filepath = parsedUrl.query.filepath;
    console.log(filepath);
    let sql = 'delete from file where filepath=$1';
    let r = await con.query(sql, [filepath]);
    console.log(r.rows);
    res.send({ ok: true, msg: "删除成功" });

    var pathname = path.join('./public/files/'+filepath);
    fs.unlinkSync(pathname);
  } catch (err) {
    res.send({ ok: false, msg: "删除失败" });
  }
});

router.get('/selectFile', function(req, res, next) {
  //res.render('.iews/index');
  res.render('selectFile');
 });

router.get('/select', async (req, res, next)=> {
  try {
    var filepath = '%' + req.query.title + '%';
    let sql = 'select * from file where filepath like $1';
    let r = await con.query(sql, [filepath]);
    // console.log(r.rows,typeof(r.rows));
    var list = r.rows;
    console.log(list);
    res.send({ ok: true, msg: list});
  } catch (err) {
    res.send({ ok: false, msg: '查找失败'});
  }
});
module.exports = router;
