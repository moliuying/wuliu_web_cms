"use strict";
/*
 * require modules
 */
let Router = require('koa-router');
let router = new Router();


let reciver_contro= require("../contro/reciver_contro");

//添加接收人
router.post("/create",
    reciver_contro.create,
);

//获取列表
router.get("/get_list",
    reciver_contro.get_list,
);

//删除接收人
router.post("/del",
    reciver_contro.del,
);



/*
 * expose
 */
module.exports = router.routes();