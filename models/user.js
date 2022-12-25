const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstname: { type: String, require: true },
    lastname: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    phone: { type: String, require: true },
    password: { type: String, require: true },
    shopcart: { type: Array ,},
    orders: { type: Array },
    favorites: { type: Array },
    adresses: { type: Array },
    wallet: { type: Number, default: 0 }



});

module.exports = mongoose.model("user", userSchema);