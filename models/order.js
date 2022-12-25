const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    user: { type: Object, require: true },
    products: { type: Array, require: true, },
    adress: { type: Object, require: true },
    amount: { type: Number, require: true }


});

module.exports = mongoose.model("order", orderSchema);