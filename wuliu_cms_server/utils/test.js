let Client = require('ssh2-sftp-client');
let gaze = require('gaze');
var SqliteDB = require('./sqlite.js').SqliteDB;
let path = require('path');

function put(localPath,romotePath){
    let sftp = new Client();
    sftp.connect({
        host: '151.80.32.112',
        port: '22',
        username: 'root',
        password: '13JeieNTZwfD'
    }).then(() => {
        return sftp.put(localPath,romotePath);
    }).then(() =>{
        console.log("上传完成");
        sftp.end();
    }).catch((err) => {
        console.log(err, 'catch error');
    });
}


function get(romotePath, localPath){
    let sftp = new Client();
    sftp.connect({
        host: '151.80.32.112',
        port: '22',
        username: 'root',
        password: '13JeieNTZwfD'
    }).then(() => {
        return sftp.get(romotePath, localPath);
    }).then(() =>{
        console.log("下载完成");
        sftp.end();
    }).catch((err) => {
        console.log(err, 'catch error');
    });
}

// var file = "../ssh/index.sqlite3";
// var sqliteDB = new SqliteDB(file);
//
//
// //创建人表
// let create_user_sql = "create table if not exists user(_id INTEGER PRIMARY KEY  NOT NULL ,name varchar(20), age int default 18,uid int NOT NULL UNIQUE, create_time datetime default (datetime('now', 'localtime')), update_time datetime default (datetime('now', 'localtime')) );";
// sqliteDB.createTable(create_user_sql);
//
// //创建借书表
// let create_books_sql = "create table if not exists books(_id INTEGER PRIMARY KEY,age int default 100, book_name varchar(20), uid int);";
// sqliteDB.createTable(create_books_sql);
//
// sqliteDB.insertData("insert into user(name, uid, age) values(?, ?, ?)", [["张三", 64,180], ["李四", 65,280]]);
// sqliteDB.insertData("insert into books(book_name, uid) values(?, ?)", [["丰乳肥臀", 1], ["哈利波特", 2]]);


// gaze(['../ssh/*.*','./test/test.js'], function(err, watcher) {
//     let watched = this.watched();
//     //监听文件的变化
//     this.on('changed', (filepath) => {
//         //romotePath是我文件的远程位置
//         filepath = filepath.replace(/\\/g,"/")
//         let last_index = filepath.lastIndexOf("/");
//         let romotePath = '/mnt' + filepath.substr(last_index)
//         console.log(romotePath);
//
//
//         //上传文件的函数
//         put(filepath,romotePath);
//         //下载文件的函数
//         get("/mnt/test.js", path.resolve(__dirname, '../ssh/down_test.js'));
//         console.log(filepath + ' 文件改变了');
//     });
// });


get("/mnt/test.js", path.resolve(__dirname, '../ssh/down_test.js'));