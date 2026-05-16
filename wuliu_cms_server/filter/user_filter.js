let G_Tools = require("../utils/tools/general_tools");


const User_service= require("../servers/user_servers");
module.exports = {
    // check_if_login: async (ctx, next) =>{
    //     try {
    //         if(ctx.session.user_info){
    //             await next();
    //             // ctx.body =  G_Tools.GetRESTFulAPICorrectMsgBack(1, 1)
    //         }else{
    //             ctx.body = G_Tools.GetRESTFulAPIErrorMsgBack(-100,"登录超时,请重新登录")
    //         }
    //     } catch (e) {
    //         throw e;
    //     }
    // },
    check_login_param: async (ctx, next) =>{
        try {
            let { user_name, password } = ctx.request.body;
            console.log(user_name);
            console.log(password);
            if(!user_name  || !password){
                ctx.body =  G_Tools.GetRESTFulAPIErrorMsgBack(0,"参数不正确")
                return;
            }
            await next();
        } catch (e) {
            throw e;
        }
    }
};