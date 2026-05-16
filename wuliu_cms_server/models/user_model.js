
let Mongoose = require("../servers/mongoose_promise");
let o_id = Mongoose.Schema.Types.ObjectId;

const userSchema = Mongoose.Schema({
    user_name:{required: true, type: String},
    password:{required: true, type: String},
    cellphone:{required: true, type: String},
    address:{required: true, type: String},
    createAt:{required: true, type: Date},
    updateAt:{required: true, type: Date},
    is_delete:{ required: true, type: Boolean, default: false}
})

//每次执行都会调用,时间更新操作
userSchema.pre('save', function (next) {
    if (this.isNew) {
        this.createAt = this.updateAt = Date.now();
    } else {
        this.updateAt = Date.now();
    }
    next();
})
//暴露出去的方法

module.exports = Mongoose.model("users", userSchema);
// module.exports = userSchema;
