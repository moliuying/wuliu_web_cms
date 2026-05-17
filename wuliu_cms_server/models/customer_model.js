
let Mongoose = require("../servers/mongoose_promise");
let o_id = Mongoose.Schema.Types.ObjectId;

const customerSchema = Mongoose.Schema({
    company_name: { required: true, type: String },
    contact_name: { required: true, type: String },
    email: { required: true, type: String },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    credit_rating: { type: Number, default: 3, min: 1, max: 5 },
    total_orders: { type: Number, default: 0 },
    total_amount: { type: Number, default: 0 },
    remark: { type: String, default: '' },
    createAt: { required: true, type: Date },
    updateAt: { required: true, type: Date },
    is_delete: { required: true, type: Boolean, default: false }
})

customerSchema.pre('save', function (next) {
    if (this.isNew) {
        this.createAt = this.updateAt = Date.now();
    } else {
        this.updateAt = Date.now();
    }
    next();
})

module.exports = Mongoose.model("customers", customerSchema);
