//连接mongoose

var mongoose = require('mongoose');
mongoose.set('debug', true);

// 优先读取本地配置文件（已加入 .gitignore，不会推送到远程）
// 若本地配置不存在（如 CI/生产环境），则降级使用环境变量 DB_URL
var db_url;
try {
    var localConfig = require('./db_url');
    db_url = localConfig.db_url;
} catch (e) {
    db_url = process.env.DB_URL || 'mongodb://localhost/wuliu';
}

var options = {
    db: { native_parser: true },
    server: { poolSize: 5 },
    auto_reconnect: true,
    useNewUrlParser: true,
    user: process.env.DB_USER || 'sandygogoing',
    pass: process.env.DB_PASS || 'aA0_9999',
    useUnifiedTopology: true
}

mongoose.connect(db_url, options);

var db = mongoose.connection;
mongoose.connection.on('error', () => {
    console.log('Mongoose connection error')
});
db.once('open', function () {
    // we're connected!
    console.log('Mongoose Connection success!')
});
