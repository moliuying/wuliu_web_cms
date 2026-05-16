"use strict";
/*
 * require modules
 */
let Router = require('koa-router');
let router = new Router();
// let user_filter= require("../filter/user_filter");
// let user_mid= require("../middleware/user_mid");
let index_control= require("../contro/index_control");

//上传文件
router.post("/upfile",
    index_control.upfile
);

//提交数据
router.post("/submit",
    index_control.submit
);




//新建或者编辑报价数据
router.post("/createOrEdit_quotation",
    index_control.submit_quotation
);
//获取报价数据列表
router.get("/get_quotation_list",
    index_control.get_quotation_list
);
//根据参数获取报价数据

router.get("/get_quotation_by_params",
    index_control.get_quotation_by_params
);
// 删除报价数据
router.post("/del_quotation_info",
    index_control.del_quotation_info
);


//获取状态数据
router.post("/get_status_list",
    index_control.get_status_list
);


//获取数据
router.get("/get_list",
    index_control.get_list
);



//删除

router.post("/del_info",
    index_control.del_info
);


// //测试1
router.get("/test",
    index_control.test
);

//测试2
router.post("/test",
    index_control.test
);

/*
 * expose
 */
module.exports = router.routes();
