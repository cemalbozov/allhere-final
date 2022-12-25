const mongoose = require("mongoose")

const Product = require("./models/product")

mongoose.connect('mongodb://127.0.0.1/all_here', { useNewUrlParser: true, useUnifiedTopology: true });

Product.create({
    _id: "1011",
    name: "Sphere + Beyaz Bluetooth Kulaklık ve Hoparlör",
    brand: "Motorola",
    prddesc: "22 SAATE KADAR KULLANIM SÜRESİ,BASİT KENETLENME YUVASI VE KOLAY ŞARJ EDİLEBİLEN KULAKLIK 18 M'YE KADAR KAPSAMA ALANI",
    category: "hoparlor",
    attribute: [
        { "Çekim Mesafesi": "18M" },
        { "Çalışma Süresi": "22 Saat" }],
    price: 2999,
    img: "img/19.jpeg",
    discount: false,
    



}, (err, result) => {
    if (err) throw err;
    console.log(result);
});

/* Product.create({
    _id: "1006",
    name: "iphone 8",
    brand: "apple",
    prddesc: "lorem ipsum dolor sit amet",
    category: "telefon",
    attribute: [
        { işlemci: "a15" },
        { kamera: "12MP" },
        { anakart: "5GB" },
        { lorem: "3gb" },
        { wifi: "var" },
        { internet: "var" },
        { random: "evet" }],
    price: 23200,
    img: "img/4.jpeg",
    discount: true,
    discprice: 25800

}, (err, result) => {
    if (err) throw err;
    console.log(result);
}); */