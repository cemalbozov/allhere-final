const mongoose = require("mongoose")

const prdSchema = new mongoose.Schema({
    _id: { type: String, require: true },
    name: { type: String, require: true },
    brand: { type: String, require: true },
    prddesc: { type: String, require: true },
    category: { type: String, require: true },
    attribute: { type: Array },
    price: { type: Number, require: true },
    discount: { type: Boolean, default: false },
    discprice: { type: Number },
    img: { type: String }


});

module.exports = mongoose.model("product", prdSchema);