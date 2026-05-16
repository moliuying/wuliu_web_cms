
let Mongoose = require("../servers/mongoose_promise");
let o_id = Mongoose.Schema.Types.ObjectId;

const reciverSchema = Mongoose.Schema({
    shoujian_name:{required: true, type: String},
    shoujian_cellphone:{required: true, type: String},
    shoujian_address:{required: true, type: String},
    shoujian_youbian:{required: true, type: String},
    desc:{required: false, type: String},
    createAt:{required: true, type: Date},
    updateAt:{required: true, type: Date},
    is_delete:{ required: true, type: Boolean, default: false}
})

//每次执行都会调用,时间更新操作
reciverSchema.pre('save', function (next) {
    if (this.isNew) {
        this.createAt = this.updateAt = Date.now();
    } else {
        this.updateAt = Date.now();
    }
    next();
})
module.exports = Mongoose.model("recivers", reciverSchema);
