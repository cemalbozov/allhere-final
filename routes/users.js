const express = require("express")
const router = express.Router()
const User = require("../models/user")
const Product = require("../models/product")
const Order = require("../models/order")
const { json } = require("body-parser")


router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    email = req.body.email
    User.findOne({ email }, function (err, user) {
        if (user) {
            console.log("e-mail kullanılmakta")
            req.session.sessionFlash = {
                class: "alert alert-danger",
                message: "Bu e-posta kullanılmaktadır"
            }
            res.redirect("/users/register")
        }
        else {
            User.create({
                firstname: req.body.name.toUpperCase(),
                lastname: req.body.lastname.toUpperCase(),
                email: req.body.email,
                password: req.body.password,
                phone: req.body.phone
            }, (err, result) => {
                if (err) throw err;
                else {
                    console.log(result);
                    res.redirect("/")
                }

            })
        }
    })



})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }, function (err, user) {
        if (user) {
            if (user.password == password) {
                req.session.userId = user.id
                res.redirect("/")
            }
            else {
                req.session.sessionFlash = {
                    class: "alert alert-warning",
                    message: "Hatalı Şifre girdiniz"
                }
                res.redirect("/users/login")
            }
        }
        else {
            req.session.sessionFlash = {
                class: "alert alert-danger",
                message: "Bu e-postaya ait kullanıcı bulunamadı. Lütfen kayıt olun !"
            }
            res.redirect("/users/register")

        }
    })
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect("/")
    })
})

router.get('/shopcart', (req, res) => {
    if (req.session.userId) {
        //kullanıcının sepetindeki ürünIdleri alınıyor
        User.findById(req.session.userId).lean().then(user => {
            let shopcart = user.shopcart
            let products = []

            //kullanıcının sepetinde ürün yoksa
            if (shopcart.length == 0) {
                res.render("shopcart")
            }
            else {
                //alınan ürünIdlere göre ürünler alınıyor
                for (let i = 0; i < shopcart.length; i++) {
                    Product.findById(shopcart[i]).lean().then(product => {
                        products.push(product)
                        if (products.length == shopcart.length) {
                            
                            res.render("shopcart", { products: products, adresses: user.adresses })
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

router.post('/addshopcart/:site', (req, res) => {
    if (req.session.userId) {
        User.findOneAndUpdate(
            { _id: req.session.userId },
            { $addToSet: { shopcart: req.body.id } }, { upsert: true },
            function (error, success) {
                if (error) {
                    console.log(error);
                }
            });
        if (req.params.site == "product") {
            res.redirect(`/product/${req.body.id}`)
        }
        else {
            res.redirect("/account/favorilerim")
        }
    }
    else {
        res.redirect("/users/login")
    }
})

router.delete("/shopcart/:id", (req, res) => {

    User.findOneAndUpdate(
        { _id: req.session.userId },
        { $pull: { shopcart: req.params.id } },
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log(req.params.id + " id li ürün silindi");
            }
        });
    res.redirect("/users/shopcart")
})

router.delete("/shopcart/delete/deleteall", (req, res) => {

    User.findOneAndUpdate(
        { _id: req.session.userId },
        { $set: { shopcart: [] } },
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("sepet boşaldı");
            }
        });
    res.redirect("/users/shopcart")
})

router.post('/shopcart/order/create_order/:amount', (req, res) => {
    if (req.session.userId) {

        let products = []
        //kullanıcının sepetindeki ürünIdleri alınıyor
        User.findById(req.session.userId).lean().then(user => {

            // cüzdan bakiyesi yeterliyse ;
            if (req.params.amount <= user.wallet) {
                let new_wallet = user.wallet - req.params.amount;
                User.findByIdAndUpdate(req.session.userId, { wallet: new_wallet },
                    function (err, docs) {
                        if (err) {
                            console.log(err)
                        }
                    });

                let shopcart = user.shopcart

                //alınan ürünIdlere göre ürünler alınıyor
                for (let i = 0; i < shopcart.length; i++) {
                    Product.findById(shopcart[i]).lean().then(product => {
                        products.push(product)
                        if (i == shopcart.length - 1) {

                            let order =
                            {
                                products: products,
                                adress: req.body.adress,
                                amount: req.params.amount
                            }

                            Order.create({

                                user: user,
                                products: products,
                                adress: req.body.adress,
                                amount: req.params.amount

                            }, (err, result) => {
                                if (err) throw err;
                                else {
                                    console.log("sipariş oluşturuldu");
                                    res.redirect("/")
                                }

                            })

                            User.findOneAndUpdate(
                                { _id: req.session.userId },
                                {
                                    $set: { shopcart: [] },
                                    $push: { orders: order }
                                },
                                function (error, success) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log("sepet boşaldı");
                                    }
                                });


                            // Oluşturulan siparişin Mail olarak gönderilmesi

                                const mail_html = `<p>${user._id} Id li ${user.firstname} ${user.lastname} adlı kullanıcı yeni bir sipariş oluşturdu.</p>`


                            "use strict";
                            const nodemailer = require("nodemailer");

                            // async..await is not allowed in global scope, must use a wrapper
                            async function main() {
                                // Generate test SMTP service account from ethereal.email
                                // Only needed if you don't have a real mail account for testing
                                let testAccount = await nodemailer.createTestAccount();

                                // create reusable transporter object using the default SMTP transport
                                let transporter = nodemailer.createTransport({
                                    host: "smtp.gmail.com",
                                    port: 465,
                                    secure: true, // true for 465, false for other ports
                                    auth: {
                                        user: "cemal.bozahmet.cb@gmail.com", // generated ethereal user
                                        pass: "hvefyvkjajbvvwlr", // generated ethereal password
                                    },
                                });

                                // send mail with defined transport object
                                let info = await transporter.sendMail({
                                    from: '"allhere.com" <cemal.bozahmet.cb@gmail.com>', // sender address
                                    to: "cemal.bozahmet.cb@gmail.com", // list of receivers
                                    subject: "Yeni Sipariş", // Subject line
                                    text: "Hello world?", // plain text body
                                    html: mail_html, // html body
                                });

                                console.log("Message sent: %s", info.messageId);
                                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                                // Preview only available when sending through an Ethereal account
                                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                            }

                            main().catch(console.error);




                        }
                    });

                }
            }

            // bakiye yetersiz ise ;
            else {
                req.session.sessionFlash = {
                    class: "alert alert-warning",
                    message: "Yetersiz bakiye !"
                }
                res.redirect("/account/wallet")
            }
        });
    }

    // giriş yapılmadı ise ;
    else {
        res.redirect("/users/login")
    }

})

module.exports = router;