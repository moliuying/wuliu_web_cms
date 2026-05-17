"use strict";
/**
 * 所有Service的父类
 */
let Mongoose = require("./mongoose_promise");


function CommonService(Model) {
    this.model = Model;
}

CommonService.prototype.Create = function(doc) {
    return this.model.create(doc);
};

/**
 * 添加
 * @params {Object|Array} doc
 * @return {Promise}
 */
CommonService.prototype.Insert = function(doc) {
    try {
        doc.create_time = Date.now();
        doc.update_time = Date.now();
        doc.is_delete = false;
        // //console.log(doc);
        //  //console.log("dddddddddddddddd");
        return this.model.create(doc);
    } catch (e) {
        throw e;
    }
};
/**
 * 根据Id获取Model
 * @param {ObjectId} id
 * @return {Promise}
 */
CommonService.prototype.FindById = function(id) {
    return this.model.findById(id).exec();
};
/**
 * 根据查询条件获取数据的数量
 * @param {Object} query
 * @return {Promise}
 */
CommonService.prototype.CountByQuery = function(query) {
    return this.model.count(query).exec();
};
/**
 * 根据查询条件获取一条数据
 * @param {Object} query
 * @param {String|Object} fields
 * @param {Object} opt
 * @returns {Promise}
 *
 */
CommonService.prototype.FindOne = function(query, fields, opt) {
    return this.model.findOne(query, fields, opt).exec();
};
/**
 * 根据查询条件获取Model
 * @param {Object} query
 * @param {String|Object} fields
 * @param {Object} opt
 * @returns {Promise}
 */
CommonService.prototype.GetByQuery = function(query, fields, opt) {
    return this.model.find(query, fields, opt).exec();
};
/**
 * 获取所有数据
 * @param {String} fields
 * @param {Object} opt
 * @returns {Promise}
 */
CommonService.prototype.GetAll = function(fields, opt) {
    return this.model.find({}, fields, opt).exec();
};
/**
 * 根据查询条件删除
 * @param {Object} query
 * @returns {Promise}
 */
CommonService.prototype.Delete = function(query) {
    return this.model.remove(query).exec();
};
/**
 * 根据条件更新一条或多条数据
 * @param {Object} query
 * @param {Object} update
 * @param {Object} opt
 * @returns {Promise}
 */
CommonService.prototype.Update = function(query, update, opt) {
    if (update.$set instanceof Object) {
        update.$set.update_time = Date.now();
    } else {
        update.$set = { update_time: Date.now() };
    }
    return this.model.update(query, update, opt).exec();
};
/**
 * 查找并更新
 * @param {Object} obj
 * @returns {Promise}
 */
CommonService.prototype.FindByIdAndUpdate = function(obj) {
    let _id = obj._id;
    delete obj._id;
    obj.update_time = Date.now();
    return this.model.findByIdAndUpdate(_id, obj, { new: true }).exec();
};
/**
 * 找到一个并更新
 * @param {Object} query
 * @param {Object} update
 * @param {Object} opt
 * @returns {Promise}
 */
CommonService.prototype.FindOneAndUpdate = function(query, update, opt) {
    if (update.$set instanceof Object) {
        update.$set.update_time = Date.now();
    } else {
        update.$set = { update_time: Date.now() };
    }
    return this.model.findOneAndUpdate(query, update, opt).exec();
};
/**
 * 找到并删除
 * @param {ObjectId} id
 * @returns {Promise}
 */
CommonService.prototype.FindByIdAndRemove = function(id) {
    let query = {
        _id: id
    };
    return this.model.findOneAndRemove(query).exec();
};
/**
 * 查找并分页
 * @param {Object} query //查询条件
 * @param {Number|String} currentPage //当前页码号
 * @param {Number|String} limit //每页限制返回条数
 * @param {Object|String} select //选择字段
 * @param {Object|String} sort //选择排序
 * * @param {Object|String} connentModel //要连接的表
 * @returns {Promise}
 */
CommonService.prototype.FindAndPaging = function(query, currentPage, limit, populate, sort, select) {
    // console.log(query);
    //     console.log(currentPage);
    //     console.log(limit);
    return this.model.find(query).skip(currentPage > 0 ? ((currentPage - 1) * limit) : 0)
        .limit(limit)
        .sort(sort)
        .populate(populate)
        .select(select)
        .exec();
};

CommonService.prototype.FindOneAndSort = function(query, condition) {
    return this.model.findOne(query).sort(condition).exec();
};

CommonService.prototype.FindAndSort = function(query,fields, condition) {
    return this.model.find(query,fields).sort(condition).exec();
};


CommonService.prototype.getModel = function(query, condition) {
    return this.model;
};


module.exports = CommonService;