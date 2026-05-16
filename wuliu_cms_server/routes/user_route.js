"use strict";
/*
 * require modules
 */
let Router = require('koa-router');
let router = new Router();



let user_filter= require("../filter/user_filter");
let user_mid= require("../middleware/user_mid");

let user_control= require("../contro/user_contro");

//登录
router.post("/login",
    user_filter.check_login_param,
    user_mid.check_login_user_if_have,
    user_control.login
);
//注册
router.post("/register",
    // user_filter.check_login_param,
    // user_mid.check_login_user_if_have,
    user_control.register
);

/*
 * expose
 */
module.exports = router.routes();