let G_Tools = require("../utils/tools/general_tools");
let moment = require("moment");
let fs = require("fs");
let path = require("path");



let reciver_service= require("../servers/reciver_service");
module.exports = {
    create: async (ctx, next) => {
        try {
            let { shoujian_name,shoujian_cellphone,shoujian_address,shoujian_youbian } = ctx.request.body;
            let data = await  reciver_service.Insert({
                shoujian_name,
                shoujian_cellphone,
                shoujian_address,
                shoujian_youbian,
                desc:'',
                createAt: Date.now(),
                updateAt: Date.now()
            })
            ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(1, data);
        } catch (e) {
            throw e;
        }
    },
    get_list: async (ctx,next)=>{
        try{
            let data = ctx.request.query;
            let { page ,limit=10} = data;
            console.log(limit);
            let query = {
                is_delete: false
            };
            let count = await reciver_service.CountByQuery(query);
            let result_data = await reciver_service.FindAndPaging(query,page,+limit,'',{_id:-1})
            ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(count, result_data);
        }catch (e) {
            throw e;
        }
    },
    //删除数据
    del: async (ctx,next)=>{
        try {
            let { _id } = ctx.request.body;
            let result_data = await reciver_service.FindByIdAndRemove({
                _id: _id
            })
            ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(1, result_data);
        } catch (e) {
            throw e;
        }
    }
}