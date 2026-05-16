// #数据库数据存放目录
// dbpath= C:\Program Files\MongoDB\Server\4.2\data
// #数据库日志存放目录
// logpath= C:\Program Files\MongoDB\Server\4.2\log\mongod.log
// #以追加的方式记录日志
// logappend = true
// #端口号 默认为27017
// port=26017
// #开启用户认证
// auth=true
// #关闭http接口，默认关闭http端口访问
// # nohttpinterface=true
// #mongodb所绑定的ip地址
// bind_ip = 127.0.0.1
// #启用日志文件，默认启用
// journal=true
//
//
//
//
// systemLog:
//     destination: file
// path: C:\Program Files\MongoDB\Server\4.2\log\mongod.log
// logAppend: true
// auth = true
// storage:
//     dbPath: C:\Program Files\MongoDB\Server\4.2\data
//
// net:
//     bindIp: 0.0.0.0
//
//
//
// db.createUser(
//     {
//         user:"sandygogoing",
//         pwd:"aA0_9999",
//         roles:[
//             {role:"readWrite",db:"wuliu"},
//             {role:"dbOwner",db:"wuliu"}
//         ]
//     }
// )
