
"use strict";
let Router = require('koa-router');
let router = new Router();

let customer_control = require("../contro/customer_control");

router.post("/create",
    customer_control.create,
);

router.post("/update",
    customer_control.update,
);

router.get("/get_list",
    customer_control.get_list,
);

router.get("/get_all",
    customer_control.get_all,
);

router.get("/get_detail",
    customer_control.get_detail,
);

router.post("/del",
    customer_control.del,
);

module.exports = router.routes();
