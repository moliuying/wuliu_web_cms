

let G_Tools = require("../utils/tools/general_tools");


const User_service= require("../servers/user_servers");
let moment = require("moment");
module.exports = {
    login : async (ctx, next) =>{
        try {
            ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(1, ctx.session.user_info );
        } catch (e) {
            throw e;
        }
    },
    register : async (ctx, next) =>{
        try {
    
            let { user_name,password,cellphone,address } = ctx.request.body;
            let user_len = await User_service.CountByQuery({
                user_name: user_name
            });
            
            if(user_len){
                ctx.body = G_Tools.GetRESTFulAPIErrorMsgBack(1, "用户名已存在!") ;
            }else{
                delete ctx.request.body["password2"];
                console.log( ctx.request.body );
                let data = await User_service.Insert(
                    {
                        user_name,password,cellphone,address,
                        createAt: Date.now(),
                        updateAt: Date.now()
                    }
                )
                ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(1, "注册成功,去登陆吧") ;
            }
        } catch (e) {
            throw e;
        }
    }
};