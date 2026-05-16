let G_Tools = require("../utils/tools/general_tools");


const User_service= require("../servers/user_servers");
module.exports = {
    check_login_user_if_have: async (ctx, next) => {
        try {
            let { user_name, password} = ctx.request.body;
            let user_info = await User_service.FindOne({
                user_name,
                password
            });
            if(user_info){
                ctx.session.user_info = user_info;
                await next();
            }else {
                ctx.body = G_Tools.GetRESTFulAPIErrorMsgBack(1, "用户名或密码错误请检查!") ;
            }
        } catch (e) {
            throw e;
        }
    }
};