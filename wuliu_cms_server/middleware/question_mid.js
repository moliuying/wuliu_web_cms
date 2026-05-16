let G_Tools = require("../utils/tools/general_tools");


const Project = require("../models/project");

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
    }
};