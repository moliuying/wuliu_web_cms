let G_Tools = require("../utils/tools/general_tools");


const Project = require("../models/project");
const User = require("../models/user");

module.exports = {
    check_accept_param: async (ctx, next) => {
        try {
            let { name } = ctx.request.body;
            let count = await Project.count({
                where: {
                    "create_uid": ctx.session.user_info.id,
                    "name": G_Tools.Trim(name)
                }
            });
            if (count) {
                ctx.body = G_Tools.GetRESTFulAPIErrorMsgBack(0, "项目名称已存在");
                return;
            }
            await next();
        } catch (e) {
            throw e;
        }
    },
    
    check_create_name: async (ctx, next) => {
        try {
            let { name } = ctx.request.body;
            let count = await Project.count({
                where: {
                    "create_uid": ctx.session.user_info.id,
                    "is_delete": 0,
                    "name": G_Tools.Trim(name)
                }
            });
            if (count) {
                ctx.body = G_Tools.GetRESTFulAPIErrorMsgBack(0, "项目名称已存在");
                return;
            }
            
            
            // let default_num = await User.
    
            let data = await User.findOne({
                raw: true,
                where: {
                    id: ctx.session.user_info.id,
                    "is_delete": 0
                }
            });
            let count2 = await Project.count({
                where: {
                    "create_uid": ctx.session.user_info.id,
                    "is_delete": 0
                }
            });
            if (count2 >= data.project_num) {
                ctx.body = G_Tools.GetRESTFulAPIErrorMsgBack(0, "项目数量已达最大限度");
                return;
            }
            
            await next();
        } catch (e) {
            throw e;
        }
    },
    check_copy_name: async (ctx, next) => {
        try {
            let { name } = ctx.request.body;
            let count = await Project.count({
                where: {
                    "create_uid": ctx.session.user_info.id,
                    "name": G_Tools.Trim(name)
                }
            });
            if (count) {
                ctx.body = G_Tools.GetRESTFulAPIErrorMsgBack(0, "你输入的项目名称已存在");
                return;
            }
            await next();
        } catch (e) {
            throw e;
        }
    },
};