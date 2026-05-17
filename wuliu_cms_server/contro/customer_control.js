
let G_Tools = require("../utils/tools/general_tools");
let customer_service = require("../servers/customer_service");
let info_service = require("../servers/info_servers");

module.exports = {
    create: async (ctx, next) => {
        try {
            let { company_name, contact_name, email, phone, address, credit_rating, remark } = ctx.request.body;
            let data = await customer_service.Insert({
                company_name,
                contact_name,
                email,
                phone: phone || '',
                address: address || '',
                credit_rating: credit_rating || 3,
                total_orders: 0,
                total_amount: 0,
                remark: remark || '',
                createAt: Date.now(),
                updateAt: Date.now()
            })
            ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(1, data);
        } catch (e) {
            throw e;
        }
    },

    update: async (ctx, next) => {
        try {
            let { _id, company_name, contact_name, email, phone, address, credit_rating, remark } = ctx.request.body;
            let updateData = {
                _id,
                company_name,
                contact_name,
                email,
                phone: phone || '',
                address: address || '',
                credit_rating: credit_rating || 3,
                remark: remark || '',
                updateAt: Date.now()
            };
            let data = await customer_service.FindByIdAndUpdate(updateData);
            ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(1, data);
        } catch (e) {
            throw e;
        }
    },

    get_list: async (ctx, next) => {
        try {
            let data = ctx.request.query;
            let { page, limit = 10, search_value = '' } = data;
            let query = {
                is_delete: false };
            if (search_value) {
                query["$or"] = [
                    { company_name: { "$regex": search_value, "$options": 'i' } },
                    { contact_name: { "$regex": search_value, "$options": 'i' } },
                    { email: { "$regex": search_value, "$options": 'i' } }
                ];
            }
            let count = await customer_service.CountByQuery(query);
            let result_data = await customer_service.FindAndPaging(query, page, +limit, '', { _id: -1 });
            ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(count, result_data);
        } catch (e) {
            throw e;
        }
    },

    get_all: async (ctx, next) => {
        try {
            let query = { is_delete: false };
            let result_data = await customer_service.GetByQuery(query, '', { _id: -1 });
            ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(result_data.length, result_data);
        } catch (e) {
            throw e;
        }
    },

    get_detail: async (ctx, next) => {
        try {
            let { _id } = ctx.request.query;
            let customer = await customer_service.FindById(_id);
            
            let orderQuery = {
                is_delete: false,
                'data.customer_id': _id
            };
            let orderCount = await info_service.CountByQuery(orderQuery);
            let orders = await info_service.GetByQuery(orderQuery, '', { createAt: -1 });
            
            let result = customer.toObject();
            result.order_count = orderCount;
            result.orders = orders;
            
            ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(1, result);
        } catch (e) {
            throw e;
        }
    },

    del: async (ctx, next) => {
        try {
            let { _id } = ctx.request.body;
            let result_data = await customer_service.FindByIdAndUpdate({
                _id: _id,
                is_delete: true,
                updateAt: Date.now()
            });
            ctx.body = G_Tools.GetRESTFulAPICorrectMsgBack(1, result_data);
        } catch (e) {
            throw e;
        }
    },

    update_order_stats: async (customer_id, amount) => {
        try {
            let customer = await customer_service.FindById(customer_id);
            if (customer) {
                customer.total_orders = (customer.total_orders || 0) + 1;
                customer.total_amount = (customer.total_amount || 0) + (amount || 0);
                customer.updateAt = Date.now();
                await customer.save();
            }
        } catch (e) {
            console.error('Update customer order stats error:', e);
        }
    }
}
