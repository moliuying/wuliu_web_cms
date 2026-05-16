let Router = require('koa-router');
let router = new Router();
let user_router = require("./user_route");
let index_router = require("./index_route");
let reciver_router = require("./reciver_route");


router.use(async (ctx, next) => {
    console.log( "请求ip为"+ctx.request.ip )
    ctx.type = 'json';
    await next();
});
router.use("/user", user_router);
router.use("/index", index_router);
router.use("/reciver", reciver_router);
module.exports = router.routes();

