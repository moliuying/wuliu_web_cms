
let Mongoose = require("../servers/mongoose_promise");
let o_id = Mongoose.Schema.Types.ObjectId;

const Schema = Mongoose.Schema({
    user_id: {required: true, type: o_id},
    data: Mongoose.Schema.Types.Mixed,
    auction_ref: {required: true, type: String},
    email: {required: true, type: String},
    paymentMethod: {required: false, type: String},
    currency: {required: false, type: String},
    amendMessage: {required: false, type: String, default: ''}, //整改意见
    status: {required: true, type: Number},  //1新建 2已接受 3已拒绝
    createAt:{required: true, type: Date},
    updateAt:{required: true, type: Date},
    is_delete:{ required: true, type: Boolean, default: false}
})

//每次执行都会调用,时间更新操作
Schema.pre('save', function (next) {
    if (this.isNew) {
        this.createAt = this.updateAt = Date.now();
    } else {
        this.updateAt = Date.now();
    }
    next();
})
//暴露出去的方法

module.exports = Mongoose.model("quotations", Schema);
// module.exports = userSchema;
