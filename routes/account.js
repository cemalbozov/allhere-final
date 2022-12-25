const express = require("express")
const router = express.Router()
const User = require("../models/user")
const Product = require("../models/product")


router.get('/uyelik-bilgilerim', (req, res) => {
    if (req.session.userId) {
        User.findById(req.session.userId).lean().then(user => {
            res.render('account/uyelik-bilgilerim', { user: user })
        });
    }
})

router.post('/uyelik-bilgilerim/update', (req, res) => {
    console.log(req.body.phone)
    if (req.session.userId) {
        User.findOneAndUpdate(
            { _id: req.session.userId },
            { $set: { phone: `${req.body.phone}` } },
            function (error, success) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Bilgiler Güncellendi !");
                }
            });
        res.redirect("/account/uyelik-bilgilerim")
    }
    else {
        res.redirect("/users/login")
    }
})

router.get('/adreslerim', (req, res) => {
    if (req.session.userId) {
        //kullanıcının favorilerindeki ürünIdleri alınıyor
        User.findById(req.session.userId).lean().then(user => {
            let adresses = user.adresses
            res.render('account/adreslerim', { adresses: adresses, user: user })
        })
    }
    else {
        res.redirect("/users/login")
    }
})

router.post('/adreslerim/add', (req, res) => {
    console.log(req.body)
    if (req.session.userId) {
        User.findOneAndUpdate(
            { _id: req.session.userId },
            { $addToSet: { adresses: req.body } }, { upsert: true },
            function (error, success) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(success);
                }
            });
        res.redirect("/account/adreslerim")
    }
    else {
        res.redirect("/users/login")
    }
})

router.post("/adreslerim/delete/:adress_h", (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.session.userId },
        { $pull: { adresses: { adress_h: req.params.adress_h } } },
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("adres silindi");
            }
        });
    res.redirect("/account/adreslerim")
})

router.get('/favorilerim', (req, res) => {
    if (req.session.userId) {
        //kullanıcının favorilerindeki ürünIdleri alınıyor
        User.findById(req.session.userId).lean().then(user => {
            let favorites = user.favorites
            let products = []

            //kullanıcının favorilerinde ürün yoksa
            if (favorites.length == 0) {
                res.render("account/favorilerim",{user: user})
            }
            else {
                //alınan ürünIdlere göre ürünler alınıyor
                for (let i = 0; i < favorites.length; i++) {
                    Product.findById(favorites[i]).lean().then(product => {
                        products.push(product)
                        if (products.length == favorites.length) {
                            res.render("account/favorilerim", { products: products, user: user })
                            console.log(user)
                        }
                        

                    });
                }
            }
        });
    }
    else {
        res.redirect("/users/login")
    }
})

router.post('/addfavorites/:site', (req, res) => {
    if (req.session.userId) {
        User.findOneAndUpdate(
            { _id: req.session.userId },
            { $addToSet: { favorites: req.body.id } }, { upsert: true },
            function (error, success) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("favorilere eklendi");
                }
            });
        if (req.params.site == "product") {
            res.redirect(`/product/${req.body.id}`)
        }
        else {
            res.redirect(`/`)
        }
    }
    else {
        res.redirect("/users/login")
    }
})

router.delete("/favorilerim/:id", (req, res) => {

    User.findOneAndUpdate(
        { _id: req.session.userId },
        { $pull: { favorites: req.params.id } },
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("ürün favorilerden silindi");
            }
        });
    res.redirect("/account/favorilerim")
})

router.get('/wallet', (req, res) => {
    if (req.session.userId) {
        User.findById(req.session.userId).lean().then(user => {
            res.render('account/wallet', { user: user })
        });
    }
})

router.post('/wallet/add', (req, res) => {
    console.log(req.body.add_wallet)
    if (req.session.userId) {
        User.findOneAndUpdate(
            { _id: req.session.userId },
            { $inc: { wallet: req.body.add_wallet } },
            function (error, success) {
                if (error) {
                    console.log(error);
                }
            });
        req.session.sessionFlash = {
            class: "alert alert-succes",
            message: "girilen miktar cüzdana eklendi !"
        }
        res.redirect("/account/uyelik-bilgilerim")
    }
    else {
        res.redirect("/users/login")
    }
})

router.get('/siparislerim', (req, res) => {
    if (req.session.userId) {

        User.findById(req.session.userId).lean().then(user => {
            let orders = [];
            user.orders.forEach(ord => {
                orders.push(ord.products)
            });
            console.log(orders)
            if (orders.length == 0) {
                res.render("account/siparislerim")
            }
            else {
                res.render("account/siparislerim", { orders: orders, user: user})
            }
        });
    }
    else {
        res.redirect("/users/login")
    }
})

router.get('/admin-panel', (req, res) => {
    if (req.session.userId) {
        User.findById(req.session.userId).lean().then(user => {
            res.render('account/admin-panel', { user: user })
        });
    }
})

module.exports = router;