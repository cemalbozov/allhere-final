const express = require("express")
const router = express.Router()
const database = require('../database');


/* router.get('/uyelik-bilgilerim', (req, res) => {
    if (req.session.userId) {
        User.findById(req.session.userId).lean().then(user => {
            res.render('account/uyelik-bilgilerim', { user: user })
        });
    }
}) */

router.get('/uyelik-bilgilerim', (req, res) => {
    if (req.session.userId) {
        database.query("SELECT * FROM user Where _id = ?", [req.session.userId], function (err, result) {
            if (err) throw err;
            console.log(result);
            res.render('account/uyelik-bilgilerim', { user: result[0] })
        })
    }
})

/* router.post('/uyelik-bilgilerim/update', (req, res) => {
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
}) */

router.post('/uyelik-bilgilerim/update', (req, res) => {
    console.log(req.body.phone)
    if (req.session.userId) {
        database.query("UPDATE user SET phone = ? WHERE _id = ?", [req.body.phone, req.session.userId], function (err) {
            if (err) throw err;
            res.redirect("/account/uyelik-bilgilerim")
        })
    }
    else {
        res.redirect("/users/login")
    }
})

/* router.get('/adreslerim', (req, res) => {
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
}) */

router.get('/adreslerim', (req, res) => {
    if (req.session.userId) {
        //kullanıcının favorilerindeki ürünIdleri alınıyor
        database.query("SELECT * FROM user Where _id = ?", [req.session.userId], function (err, result) {
            if (err) throw err;
            var user = result[0]
            database.query("SELECT * FROM adress Where UserId = ?", [req.session.userId], function (err, result) {
                if (err) throw err;

                res.render('account/adreslerim', { adresses: result, user: user })
            })

        })
    }
    else {
        res.redirect("/users/login")
    }
})

/* router.post('/adreslerim/add', (req, res) => {
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
}) */

router.post('/adreslerim/add', (req, res) => {

    if (req.session.userId) {
        database.query('INSERT INTO adress (UserID, adress_h, adress_tel, adress_city, adress_district, adress) VALUES (?,?,?,?,?,?); ', [req.session.userId, req.body.adress_h, req.body.adress_tel, req.body.adress_city, req.body.adress_district, req.body.adress], function (err, result) {
            if (err) throw err;
            console.log(result);
        })
        res.redirect("/account/adreslerim")
    }
    else {
        res.redirect("/users/login")
    }
})

/* router.post("/adreslerim/delete/:adress_id", (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.session.userId },
        { $pull: { adresses: { adress_h: req.params.adress_id } } },
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("adres silindi");
            }
        });
    res.redirect("/account/adreslerim")
}) */

router.delete("/adreslerim/delete/:adress_id", (req, res) => {

    if (req.session.userId) {
        database.query('DELETE FROM adress where AdressId = ?', [req.params.adress_id], function (err, result) {
            if (err) throw err;
            else {
                console.log("adres silindi");
                res.redirect("/account/adreslerim")
            }
        })
    }
    else {
        res.redirect("/users/login")
    }
})

/* router.get('/favorilerim', (req, res) => {
    if (req.session.userId) {
        //kullanıcının favorilerindeki ürünIdleri alınıyor
        User.findById(req.session.userId).lean().then(user => {
            let favorites = user.favorites
            let products = []

            //kullanıcının favorilerinde ürün yoksa
            if (favorites.length == 0) {
                res.render("account/favorilerim", { user: user })
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
}) */

router.get('/favorilerim', (req, res) => {
    if (req.session.userId) {

        database.query("SELECT * FROM user Where _id = ?", [req.session.userId], function (err, result) {
            if (err) throw err;
            var user = result[0]
            console.log(req.session.userId)
            //kullanıcının favorilerindeki ürünIdleri alınıyor
            database.query(`
        Select p.*, b.brand, fi.idFavoritesItem From product p
        inner join brands b on b._id = p.brandid
        inner join favoritesitem fi on fi.ProductId = p._id
        inner join favorites f on f.userId = ? and fi.FavoritesId = f.idFavorites`,
                [req.session.userId], function (err, result) {
                    if (err) throw err;

                    let favorites = result
                    console.log(result)
                    //kullanıcının favorilerinde ürün yoksa
                    if (favorites.length == 0) {
                        res.render("account/favorilerim", { user: user })
                    }
                    else {
                        res.render("account/favorilerim", { products: favorites, user: user })
                    }
                })
        })


    }
    else {
        res.redirect("/users/login")
    }
})

/* router.post('/addfavorites/:site', (req, res) => {
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
}) */

router.post('/addfavorites/:site', (req, res) => {
    if (req.session.userId) {
        database.query('INSERT INTO favoritesitem (FavoritesId, ProductId) VALUES ((SELECT f.idFavorites FROM favorites f where f.userId = ?),"?"); ', [req.session.userId, parseInt(req.body.id)], function (err, result) {
            if (err) throw err;
            else {
                console.log(result);
                if (req.params.site == "product") {
                    res.redirect(`/product/${req.body.id}`)
                }
                else {
                    res.redirect(`/`)
                }
            }
        })

    }
    else {
        res.redirect("/users/login")
    }
})

/* router.delete("/favorilerim/:id", (req, res) => {

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
}) */

router.delete("/favorilerim/:id", (req, res) => {

    database.query('DELETE FROM favoritesitem where FavoritesId = (SELECT favorites.idFavorites FROM favorites where UserId = ?) AND idfavoritesItem = ?', [req.session.userId, req.params.id], function (err, result) {
        if (err) throw err;
        res.redirect("/account/favorilerim")
    })

})

/* router.get('/wallet', (req, res) => {
    if (req.session.userId) {
        User.findById(req.session.userId).lean().then(user => {
            res.render('account/wallet', { user: user })
        });
    }
}) */

router.get('/wallet', (req, res) => {
    if (req.session.userId) {
        database.query("SELECT * FROM user Where _id = ?", [req.session.userId], function (err, result) {
            if (err) throw err;
            var user = result[0]
            res.render('account/wallet', { user: user })
        })
    }
})

/* router.post('/wallet/add', (req, res) => {
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
}) */

router.post('/wallet/add', (req, res) => {
    console.log(req.body.add_wallet)
    if (req.session.userId) {
        database.query("SELECT * FROM user Where _id = ?", [req.session.userId], function (err, result) {
            if (err) throw err;
            var user = result[0]
            var new_wallet = user.wallet + parseFloat(req.body.add_wallet)

            database.query("UPDATE user SET wallet = ? WHERE _id = ?", [new_wallet, req.session.userId], function (err) {
                if (err) throw err;

                req.session.sessionFlash = {
                    class: "alert alert-succes",
                    message: "girilen miktar cüzdana eklendi !"
                }
                res.redirect("/account/uyelik-bilgilerim")
            })
        })
    }
    else {
        res.redirect("/users/login")
    }
})

/* router.get('/siparislerim', (req, res) => {
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
                res.render("account/siparislerim", { orders: orders, user: user })
            }
        });
    }
    else {
        res.redirect("/users/login")
    }
}) */

router.get('/siparislerim', (req, res) => {
    if (req.session.userId) {

        database.query("SELECT * FROM user Where _id = ?", [req.session.userId], function (err, result) {
            if (err) throw err;
            var user = result[0]

            database.query(`
            Select p.*, b.brand, o.idOrder,oi.idOrderItem From allheredb.product p
            inner join allheredb.brands b on b._id = p.brandid
            inner join allheredb.orderitem oi on oi.ProductId = p._id
            inner join allheredb.order o on o.UserId = ? and oi.OrderId = o.idOrder
            order by o.idOrder`,
                [req.session.userId], function (err, result) {
                    if (err) throw err;
                    //kullanıcının sepetinde ürün yoksa
                    if (result.length == 0) {
                        res.render("account/siparislerim", { user: user })
                    }
                    else {
                        var orders = []
                        var order = []
                        var order_id = result[0].idOrder;

                        // gelen ürünlerin orderidsine göre gruplanması yapılıyor
                        for (let i = 0; i < result.length; i++) {


                            if (order_id == result[i].idOrder) {
                                order.push(result[i])
                            }
                            else {
                                orders.push(order)
                                order = []
                                order_id = result[i].idOrder;
                                order.push(result[i])
                            }
                            console.log(order_id)
                            if (i == result.length - 1) {
                                orders.push(order)
                            }
                        }
                        console.log(orders)


                        res.render("account/siparislerim", { orders: orders, user: user })
                    }

                })
        })
    }
    else {
        res.redirect("/users/login")
    }
})

router.get('/admin-panel', (req, res) => {
    if (req.session.userId) {

        database.query("SELECT * FROM user Where _id = ?", [req.session.userId], function (err, result) {
            if (err) throw err;
            var user = result[0]

            res.render('account/admin-panel', { user: user })

        })
    }
})

module.exports = router;