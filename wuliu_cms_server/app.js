const Koa = require('koa')
const app = new Koa()

const koaBody = require('koa-body')
app.use(koaBody({
    multipart: true,  // 支持表单上传
    formidable: {
        // maxFileSize: 10 * 1024 * 1024, // 修改文件大小限制，默认位2M
    }
}))

const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')


const static = require('koa-static');
const cors = require('koa2-cors');




app.use(cors(
    {
        origin:function (ctx) {
            let origin = ctx.request.headers.origin || '';
            const allowedOrigins = ['http://114.116.245.61:8080', 'http://43.140.245.169:8080', 'http://localhost:8080', 'http://localhost:8083'];
            if ( allowedOrigins.includes(origin)  ) {
                return origin
            } else {
                // 返回 false 而不是 null，这样可以正确处理 CORS
                return false
            }
        },
        maxAge: 8640000000000, //指定本次预检请求的有效期，单位为秒。
        credentials: true, //是否允许发送Cookie
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
    }
));


//配置session
const Koa_Session = require('koa-session');   // 导入koa-session
// 配置
const session_signed_key = ["wuliu"];  // 这个是配合signed属性的签名key
const session_config = {
    key: 'koa:sess', /**  cookie的key。 (默认是 koa:sess) */
    maxAge: 8640000000000,   /**  session 过期时间，以毫秒ms为单位计算 。*/
    autoCommit: true, /** 自动提交到响应头。(默认是 true) */
    overwrite: true, /** 是否允许重写 。(默认是 true) */
    httpOnly: true, /** 是否设置HttpOnly，如果在Cookie中设置了"HttpOnly"属性，那么通过程序(JS脚本、Applet等)将无法读取到Cookie信息，这样能有效的防止XSS攻击。  (默认 true) */
    signed: true, /** 是否签名。(默认是 true) */
    rolling: true, /** 是否每次响应时刷新Session的有效期。(默认是 false) */
    renew: false, /** 是否在Session快过期时刷新Session的有效期。(默认是 false) */
};
const session = Koa_Session(session_config, app)
app.keys = session_signed_key;
// 使用中间件，注意有先后顺序
app.use(session);




//链接数据库
require('./config/db');
//所有的接口路由
const routes = require('./routes/index')
// 配置静态web服务的中间件
app.use(static(__dirname+'./public'));
// error handler
onerror(app)
// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
console.log(666);
console.log(process.env.NODE_ENV);








// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
// routes
var router = require('koa-router')();
app.use(routes).use(router.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});


//解决跨域问题
module.exports = app
