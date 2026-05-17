let G_Tools = require("../utils/tools/general_tools");
let moment = require("moment");
let fs = require("fs");
let path = require("path");
const mongoose = require('mongoose');


let Info_service= require("../servers/info_servers");
let quotationInfo_service= require("../servers/quotation_servers");
let Info_status_service= require("../servers/info_status_service");
let customer_control = require("./customer_control");



// 引入obs库
// 使用npm安装
var ObsClient = require('esdk-obs-nodejs');
let bucketname = 'yishu';
let access_key_id = 'RQMOTHODZQBCEP2FBZ6K';
let secret_access_key = 'JOiUJhhWT1CJle0C2JIDTh4h6UgSOnuC6KjtNvXn';
let server = 'https://obs.cn-north-4.myhuaweicloud.com';
let yuming = 'https://yishu.obs.cn-north-4.myhuaweicloud.com/';


module.exports = {
    //删除报价数据
    del_quotation_info: async (ctx,next)=>{
        try {
            let { _id } = ctx.request.body;
            console.log(ctx.request.body);
            console.log(_id);
            let result_data = await quotationInfo_service.FindByIdAndRemove({
                _id: _id
            })
            ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(1, result_data);
        } catch (e) {
            throw e;
        }
    },
    //删除数据
    del_info: async (ctx,next)=>{
        try {
            let { _id } = ctx.request.body;
            console.log(ctx.request.body);
            console.log(_id);
            let result_data = await Info_service.FindByIdAndRemove({
                _id: _id
            })
            ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(1, result_data);
        } catch (e) {
            throw e;
        }
    },
    get_quotation_by_params: async (ctx,next)=>{
        try{
            let {auction_ref, email} = ctx.request.query;
            let result_data = await quotationInfo_service.FindOneAndSort({
                auction_ref,
                email
            },{_id: -1})
            ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(1, result_data);
        }catch (e) {
            throw e;
        }
    },
    get_quotation_list: async (ctx,next)=>{
        try{
            let {auction_ref, email} = ctx.request.query;
            let query = {};
            if( email ){
                query["$or"] = [ {"email":{"$regex": email,"$options": 'i'}}]
            }
            if( auction_ref ){
                query["$or"] = [ {"auction_ref":{"$regex": auction_ref,"$options": 'i'}}]
            }
            console.log(query)
            console.log( ctx.request.query)
            let result_data = await quotationInfo_service.GetByQuery({...query, is_delete: false})
            ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(1, result_data);
        }catch (e) {
            throw e;
        }
    },
    get_status_list: async (ctx,next)=>{
        try{
            let {_id} = ctx.request.body;
            let result_data = await Info_status_service.GetByQuery({info_id: _id})
            ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(1, result_data);
        }catch (e) {
            throw e;
        }
    },
    //获取列表
    get_list: async (ctx,next)=>{
        try{
            let data = ctx.request.query;
            let { page,search_value,status,name = '',auction_name = '', paimai_huozhi_sort = null,paimai_date_sort= null,createAt_sort = null,updateAt_sort = null } = data;
            let query = {
                is_delete: false,
            };
            let sortQuery = {
                "data.priority": -1,
                createAt: -1
            }
            let custom_sort = null;
            if( search_value ){
                query["$or"] = [ {"data.waybill_number":{"$regex": search_value,"$options": 'i'}},{"data.dingdan_num":{"$regex": search_value,"$options": 'i'}}]
            }
            // if( name ){
            //     query["$or"] = [ {"data.kehu_name":{"$regex": name,"$options": 'i'}}]
            // }
            // if(auction_name){
                // query["$or"] = [ {"data.paimai_name":{"$regex": /auction_name/ig}}]
            query["$and"] = [ {"data.kehu_name":{"$regex": name,"$options": 'i'}},{"data.paimai_name":{"$regex": auction_name,"$options": 'i'}}]
            // }
            
            if( status ){
                query[
                    "data.status"
                    ] = +status
            }
            
            if(paimai_huozhi_sort){
                custom_sort = { "data.paimai_huozhi": +paimai_huozhi_sort }
            }
            if(paimai_date_sort){
                custom_sort = { "data.paimai_date": +paimai_date_sort }
            }
            if(createAt_sort){
                custom_sort = { "createAt": +createAt_sort }
            }
            if(updateAt_sort){
                custom_sort = { "updateAt": +updateAt_sort }
            }
            
            if(custom_sort){
                sortQuery = {
                    "data.priority": -1,
                    ...custom_sort
                }
            }
            console.log(sortQuery)
            let count = await Info_service.CountByQuery(query);
            let result_data = await Info_service.FindAndPaging(query,page,10,'',sortQuery)
            ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(count, result_data);
        }catch (e) {
            throw e;
        }
    },
    //上传表单数据
    
    
    submit_quotation:async (ctx, next) => {
        try {
            
            let data = ctx.request.body;
            let { _id ,paymentMethod='',
                currency='', status ,amendMessage} = data;
            
            console.log("------",_id)
            console.log("------",data)
            if(_id){
                //    更新
                //    更新
                let obj = {_id,status,updateAt: Date.now()};
                if(paymentMethod){
                    obj.paymentMethod = paymentMethod;
                }
                if(currency){
                    obj.currency = currency;
                }
                if(amendMessage){
                    obj.amendMessage = amendMessage;
                }
                let result_data = ''
                if(paymentMethod || amendMessage){
                    result_data =await quotationInfo_service.FindByIdAndUpdate({...obj})
                }else{
                    delete data["_id"];
                    result_data = await quotationInfo_service.FindByIdAndUpdate({
                        _id: _id,
                        auction_ref: data.auction_ref,
                        email: data.email,
                        'data': data,
                        updateAt: Date.now()
                    })
                }
                ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(1, result_data);
            }else{
                // 插入
                delete data["_id"];
                let result_data =await quotationInfo_service.Insert(
                    {
                        'user_id': ctx.session.user_info._id,
                        'status':1,
                        'createAt': Date.now(),
                        'updateAt': Date.now(),
                        'data': data,
                        'auction_ref': data.auction_ref,
                        'email': data.email,
                        'paymentMethod': null,
                        'currency': null
                    }
                )
                ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(1, result_data);
            }
            
        } catch (e) {
            throw e;
        }
    },
    //上传表单数据
    submit:async (ctx, next) => {
        try {
            
            let data = ctx.request.body;
            let { _id } = data;
            
            if (!ctx.session.user_info.is_admin) {
                if (_id) {
                    let existing_order = await Info_service.FindById({ _id });
                    let existing_priority = existing_order && existing_order.data && existing_order.data.priority !== undefined ? existing_order.data.priority : 0;
                    if ((data.priority || 0) !== existing_priority) {
                        ctx.body = G_Tools.GetRESTFulAPIErrorMsgBack(-1, "您没有权限修改订单优先级");
                        return;
                    }
                } else {
                    if (data.priority > 0) {
                        ctx.body = G_Tools.GetRESTFulAPIErrorMsgBack(-1, "您没有权限设置高优先级");
                        return;
                    }
                }
            }
            
            console.log("------",_id)
            if(_id){
                let order = await Info_service.FindById({ _id });
                if (order && order.lock_info && order.lock_info.is_locked && order.lock_info.locked_by.toString() !== ctx.session.user_info._id.toString()) {
                    ctx.body = G_Tools.GetRESTFulAPIErrorMsgBack(-1, `订单正在被 ${order.lock_info.locked_by_name} 编辑中，无法修改`);
                    return;
                }
                //    更新
                //查询上一次是什么状态
                let prev_info_detail = await Info_service.FindById({_id });
                if(prev_info_detail.data.status || data.status){
                    //订单状态有变化。插入
                    await Info_status_service.Insert(
                        {
                            'info_id': _id,
                            'createAt': Date.now(),
                            'updateAt': Date.now(),
                            status: data.status
                        }
                    )
                }
                delete data["_id"];
                let result_data =await Info_service.FindByIdAndUpdate({
                    _id: _id,
                    'data': data,
                    updateAt: Date.now()
                })
                ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(1, result_data);
            }else{
                // 插入
                delete data["_id"];
                let result_data =await Info_service.Insert(
                    {
                        'user_id': ctx.session.user_info._id,
                        'createAt': Date.now(),
                        'updateAt': Date.now(),
                        'data': data
                    }
                )
                // 第一次插入记录状态
                // info_status_service
                await Info_status_service.Insert(
                    {
                        'info_id': result_data._id,
                        'createAt': Date.now(),
                        'updateAt': Date.now(),
                        status: 0
                    }
                )
                
                if (data.customer_id) {
                    let amount = parseFloat(data.total) || 0;
                    customer_control.update_order_stats(data.customer_id, amount);
                }
                
                ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(1, result_data);
            }
            
        } catch (e) {
            throw e;
        }
    },
    upfile: async (ctx, next) => {
        try {
            console.log(ctx.request.body);
            let { key = '' } = ctx.request.body;
            console.log(key);
    
            // 创建ObsClient实例
            var obsClient = new ObsClient({
                access_key_id: access_key_id,
                secret_access_key: secret_access_key,
                server : server
            });
            // 调用接口进行操作，例如上传对象
            let file_key = "art_logistic/"+ moment().valueOf() + ctx.request.files["file"].name;
            let type = ctx.request.files["file"].type.split('/');
            let data = await obsClient.putObject({
                Bucket : 'yishu',
                Key : file_key,
                SourceFile : ctx.request.files["file"].path
            }).then((result) => {
                // 接口调用完成，应进一步判断HTTP状态码
                console.log(result);
                // if(result.CommonMsg.Status < 300){// 操作成功
                //     if(result.InterfaceResult){
                //         // 处理操作成功后业务逻辑
                //         console.log( 'https://yishu.obs.cn-north-4.myhuaweicloud.com/'+file_key )
                //     }
                // }else{// 操作失败，获取详细异常信息
                //     console.log('Code-->' + result.CommonMsg.Code);
                //     console.log('Message-->' + result.CommonMsg.Message);
                //     console.log('HostId-->' + result.CommonMsg.HostId);
                //     console.log('RequestId-->' + result.CommonMsg.RequestId);
                // }
            }).catch((err) => {
                // 接口调用发生异常
                console.error('Error-->' + err);
            });
            // console.log(data)
            ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(1, {
                key: key,
                // src: yuming+file_key+'?x-image-process=image/resize,w_100,h_100/quality,q_80'
                src:  (type == "jpeg" || type == "jpg" || type == "png") ? yuming+file_key+'?x-image-process=image/quality,q_50': yuming+file_key
            });
        } catch (e) {
            throw e;
        }
    },
    lock_order: async (ctx, next) => {
        try {
            let { _id } = ctx.request.body;
            if (!ctx.session.user_info) {
                ctx.body = G_Tools.GetRESTFulAPIErrorMsgBack(-100, "请先登录");
                return;
            }
            let order = await Info_service.FindById({ _id });
            if (!order) {
                ctx.body = G_Tools.GetRESTFulAPIErrorMsgBack(-1, "订单不存在");
                return;
            }
            if (order.lock_info && order.lock_info.is_locked && order.lock_info.locked_by.toString() !== ctx.session.user_info._id.toString()) {
                ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(1, {
                    success: false,
                    lock_info: order.lock_info
                });
                return;
            }
            let result_data = await Info_service.FindByIdAndUpdate({
                _id: _id,
                lock_info: {
                    is_locked: true,
                    locked_by: ctx.session.user_info._id,
                    locked_by_name: ctx.session.user_info.user_name,
                    locked_at: new Date()
                },
                updateAt: Date.now()
            });
            ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(1, {
                success: true,
                lock_info: result_data.lock_info
            });
        } catch (e) {
            throw e;
        }
    },
    unlock_order: async (ctx, next) => {
        try {
            let { _id } = ctx.request.body;
            if (!ctx.session.user_info) {
                ctx.body = G_Tools.GetRESTFulAPIErrorMsgBack(-100, "请先登录");
                return;
            }
            let order = await Info_service.FindById({ _id });
            if (!order) {
                ctx.body = G_Tools.GetRESTFulAPIErrorMsgBack(-1, "订单不存在");
                return;
            }
            if (order.lock_info && order.lock_info.locked_by && order.lock_info.locked_by.toString() !== ctx.session.user_info._id.toString()) {
                ctx.body = G_Tools.GetRESTFulAPIErrorMsgBack(-1, "只有锁定者可以解锁");
                return;
            }
            let result_data = await Info_service.FindByIdAndUpdate({
                _id: _id,
                lock_info: {
                    is_locked: false,
                    locked_by: null,
                    locked_by_name: '',
                    locked_at: null
                },
                updateAt: Date.now()
            });
            ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(1, {
                success: true
            });
        } catch (e) {
            throw e;
        }
    },
    get_lock_info: async (ctx, next) => {
        try {
            let { _id } = ctx.request.query;
            let order = await Info_service.FindById({ _id });
            if (!order) {
                ctx.body = G_Tools.GetRESTFulAPIErrorMsgBack(-1, "订单不存在");
                return;
            }
            ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(1, order.lock_info || {
                is_locked: false,
                locked_by: null,
                locked_by_name: '',
                locked_at: null
            });
        } catch (e) {
            throw e;
        }
    },
    test: async (ctx, next) => {
        console.log("666");
        console.log(new Date().toLocaleTimeString());
        console.log("query",ctx.request.query);
        console.log("body",ctx.request.body);
        ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(1, "res data");
    }
}
