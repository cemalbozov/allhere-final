const express = require("express")
const router = express.Router()
const { json } = require("body-parser")
const database = require('../database');
const iyzipay = require('../iyzipay');
const { v4: uuidv4 } = require('uuid');


router.get('/register', (req, res) => {
    res.render('register')
})

// router.post('/register', (req, res) => {
//     email = req.body.email
//     User.findOne({ email }, function (err, user) {
//         if (user) {
//             console.log("e-mail kullanılmakta")
//             req.session.sessionFlash = {
//                 class: "alert alert-danger",
//                 message: "Bu e-posta kullanılmaktadır"
//             }
//             res.redirect("/users/register")
//         }
//         else {
//             User.create({
//                 firstname: req.body.name.toUpperCase(),
//                 lastname: req.body.lastname.toUpperCase(),
//                 email: req.body.email,
//                 password: req.body.password,
//                 phone: req.body.phone
//             }, (err, result) => {
//                 if (err) throw err;
//                 else {
//                     console.log(result);
//                     res.redirect("/")
//                 }

//             })
//         }
//     })



// })

router.post('/register', (req, res) => {
    email = req.body.email

    // Execute SQL query that'll select the account from the database based on the specified username and password
    database.query('SELECT * FROM user WHERE email = ?', [email], function (error, results, fields) {
        // If there is an issue with the query, output the error
        if (error) throw error;
        // If the account exists
        if (results.length > 0) {

            console.log("e-mail kullanılmakta")

            req.session.sessionFlash = {
                class: "alert alert-danger",
                message: "Bu e-posta kullanılmaktadır"
            }
            res.redirect("/users/register")

        } else {

            var sql = `INSERT INTO user (firstname, lastname, email, password, phone) VALUES ('${req.body.name.toUpperCase()}', '${req.body.lastname.toUpperCase()}', '${req.body.email}', '${req.body.password}', '${req.body.phone}')`;
            database.query(sql, function (err, result) {
                if (err) {
                    console.log(err);
                } else {

                    console.log(result);
                    var user_id = result.insertId
                    database.query('INSERT INTO shopcart (userId) VALUES (?); ',
                        [user_id], function (err, result) {
                            if (err) throw err;
                            database.query('INSERT INTO favorites (userId) VALUES (?); ',
                                [user_id], function (err, result) {
                                    if (err) throw err;


                                })

                        })
                    res.redirect("/")
                };
            });
        }

    });






})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;


    database.query("SELECT * FROM user WHERE email = ?", [email], function (err, result) {
        if (err) throw err;
        if (result.length == 0) {
            req.session.sessionFlash = {
                class: "alert alert-danger",
                message: "Bu e-postaya ait kullanıcı bulunamadı. Lütfen kayıt olun !"
            }
            res.redirect("/users/register")
        }
        else if (result[0].password != password) {

            req.session.sessionFlash = {
                class: "alert alert-warning",
                message: "Hatalı Şifre girdiniz"
            }
            res.redirect("/users/login")
        }
        else {
            req.session.userId = result[0]._id
            console.log(req.session.userId)
            res.redirect("/")
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



        database.query(`
            Select p.*, b.brand, c.idCartItem From product p
            inner join brands b on b._id = p.brandid
            inner join cartitem c on c.ProductId = p._id
            inner join shopcart s on s.UserId = ? and c.ShopCartId = s._id`,
            [req.session.userId], function (err, result) {
                if (err) throw err;

                let shopcart = result
                console.log(result)
                //kullanıcının sepetinde ürün yoksa
                if (shopcart.length == 0) {
                    res.render("shopcart")
                }
                else {
                    database.query("SELECT * FROM adress WHERE UserId = ?", [req.session.userId], function (err, result) {
                        if (err) throw err;
                        console.log(result)
                        //alınan ürünIdlere göre ürünler alınıyor
                        res.render("shopcart", { products: shopcart, adresses: result })
                        //değişecek
                    })


                }
            })
    }
    else {
        res.redirect("/users/login")
    }

})

// router.get('/shopcart', (req, res) => {
//     if (req.session.userId) {
//         //kullanıcının sepetindeki ürünIdleri alınıyor
//         User.findById(req.session.userId).lean().then(user => {
//             let shopcart = user.shopcart
//             let products = []

//             //kullanıcının sepetinde ürün yoksa
//             if (shopcart.length == 0) {
//                 res.render("shopcart")
//             }
//             else {
//                 //alınan ürünIdlere göre ürünler alınıyor
//                 for (let i = 0; i < shopcart.length; i++) {
//                     Product.findById(shopcart[i]).lean().then(product => {
//                         products.push(product)
//                         if (products.length == shopcart.length) {

//                             res.render("shopcart", { products: products, adresses: user.adresses })
//                         }

//                     });
//                 }
//             }
//         });

//     }
//     else {
//         res.redirect("/users/login")
//     }

// })

router.post('/addshopcart/:site', (req, res) => {
    if (req.session.userId) {

        database.query('INSERT INTO cartitem (ShopCartId, ProductId) VALUES ((SELECT s._id FROM shopcart s where s.UserId = ?),"?"); ', [req.session.userId, parseInt(req.body.id)], function (err, result) {
            if (err) throw err;
            console.log(result);
        })
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
// router.post('/addshopcart/:site', (req, res) => {
//     if (req.session.userId) {
//         User.findOneAndUpdate(
//             { _id: req.session.userId },
//             { $addToSet: { shopcart: req.body.id } }, { upsert: true },
//             function (error, success) {
//                 if (error) {
//                     console.log(error);
//                 }
//             });
//         if (req.params.site == "product") {
//             res.redirect(`/product/${req.body.id}`)
//         }
//         else {
//             res.redirect("/account/favorilerim")
//         }
//     }
//     else {
//         res.redirect("/users/login")
//     }
// })


router.delete("/shopcart/:id", (req, res) => {


    database.query('DELETE FROM cartitem where ShopCartId = (SELECT shopcart._id FROM shopcart where UserId = ?) AND idCartItem = ?', [req.session.userId, req.params.id], function (err, result) {
        if (err) throw err;

    })
    res.redirect("/users/shopcart")
})



// router.delete("/shopcart/:id", (req, res) => {

//     User.findOneAndUpdate(
//         { _id: req.session.userId },
//         { $pull: { shopcart: req.params.id } },
//         function (error, success) {
//             if (error) {
//                 console.log(error);
//             } else {
//                 console.log(req.params.id + " id li ürün silindi");
//             }
//         });
//     res.redirect("/users/shopcart")
// })

router.delete("/shopcart/delete/deleteall", (req, res) => {

    database.query('DELETE FROM cartitem where ShopCartId = (SELECT shopcart._id FROM shopcart where UserId = ?)', [req.session.userId], function (err, result) {
        if (err) throw err;

    })
    res.redirect("/users/shopcart")
})


router.post('/shopcart/order/checkoutform', (req, res) => {
    if (req.session.userId) {
        console.log(req.body)
        iyzipay.checkoutForm.retrieve({
            locale: "tr",
            token: req.body.token
        }, function (err, result) {
            if (err) throw err;
            console.log(result);
            let user_adress = result.basketId
            let top_price = result.price
            if (result.paymentStatus == "SUCCESS") {

                database.query("SELECT * FROM user WHERE _id = ?", [req.session.userId], function (err, user) {
                    if (err) throw err;

                    let user_detail = user;


                    database.query(
                        `Select p._id From allheredb.product p
                        inner join allheredb.cartitem c on c.ProductId = p._id
                        inner join allheredb.shopcart s on s.UserId = ? and s._id = c.ShopCartId`,
                        [req.session.userId], function (err, result) {
                            if (err) throw err;

                            let shopcart = result
                            database.query("INSERT INTO allheredb.order (UserId, AdressId, amount) VALUES (?, ?, ?);", [req.session.userId, parseInt(user_adress), parseFloat(top_price)], function (err, result) {
                                if (err) throw err;

                                let orderId = result.insertId;
                                console.log(orderId)

                                var values = [];

                                shopcart.forEach(cartitem => {
                                    values.push([orderId, cartitem._id])
                                });
                                console.log(values);

                                database.query("INSERT INTO allheredb.orderitem (OrderId, ProductId) VALUES ? ", [values], function (err) {
                                    if (err) throw err;


                                    console.log("sipariş oluşturuldu");
                                    res.redirect("/")

                                    database.query('DELETE FROM cartitem where ShopCartId = (SELECT shopcart._id FROM shopcart where UserId = ?)', [req.session.userId], function (err) {
                                        if (err) throw err;

                                        console.log("sepet boşaltıldı");

                                        // Oluşturulan siparişin Mail olarak gönderilmesi

                                        const mail_html = `<p>${user_detail[0]._id} Id li ${user_detail[0].firstname} ${user_detail[0].lastname} adlı kullanıcı yeni bir sipariş oluşturdu.</p>`


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
                                    })
                                })
                            })
                        })
                })
            }
            else {
                req.session.sessionFlash = {
                    class: "alert alert-warning",
                    message: "Ödeme İşlemi Yapılamadı!"
                }
                res.redirect("/account/wallet")
            }

        });
    }

    // giriş yapılmadı ise ;
    else {
        res.redirect("/users/login")
    }
});

router.post('/shopcart/order/create_order', (req, res) => {
    if (req.session.userId) {

        database.query(`
            Select u.*,a.* From allheredb.user u
            inner join allheredb.adress a on a.AdressId = ? 
            Where u._id = ?`, [parseInt(req.body.adress), req.session.userId], function (err, user) {
            if (err) throw err;

            var user_detail = user[0];
            const convId = uuidv4()
            console.log("ilk girişteki yer >>> " + user_detail._id);
            database.query(
                `Select p.* From product p
                inner join cartitem c on c.ProductId = p._id
                inner join shopcart s on s.UserId = ? and s._id = c.ShopCartId`,
                [req.session.userId], function (err, result) {
                    if (err) throw err;

                    let shopcart = result
                    let basketItems = [];
                    let top_price = 0.0;

                    shopcart.forEach(cartitem => {
                        let price
                        if (cartitem.discprice)
                            price = cartitem.discprice;
                        else price = cartitem.price
                        let item = {
                            id: cartitem._id,
                            name: cartitem.name,
                            category1: cartitem.categoryid,
                            itemType: "PHYSICAL",
                            price: price
                        }
                        top_price += price;
                        basketItems.push(item)
                    });
                    console.log("sepetteki ürünler >>> " + basketItems[0], basketItems[1]);
                    console.log("buyerıd >>> " + user_detail._id);

                    let request = {
                        locale: "tr",
                        conversationId: convId,
                        price: top_price,
                        paidPrice: top_price,
                        currency: "TRY",
                        basketId: parseInt(req.body.adress),
                        callbackUrl: 'https://allhere.herokuapp.com/users/shopcart/order/checkoutform',
                        enabledInstallments: [2, 3, 6, 9],
                        buyer: {
                            id: user_detail._id,
                            name: user_detail.firstname,
                            surname: user_detail.lastname,
                            gsmNumber: user_detail.phone,
                            email: user_detail.email,
                            identityNumber: '74300864791',
                            registrationAddress: `
                                ${user_detail.adress} ${user_detail.adress_district}/${user_detail.adress_city}`,
                            ip: '85.34.78.112',
                            city: user_detail.adress_city,
                            country: 'Turkey',
                        },
                        shippingAddress: {
                            contactName: `${user_detail.firstname} ${user_detail.lastname}`,
                            city: user_detail.adress_city,
                            country: 'Turkey',
                            address: `${user_detail.adress} ${user_detail.adress_district}/${user_detail.adress_city}`,
                        },
                        billingAddress: {
                            contactName: `${user_detail.firstname} ${user_detail.lastname}`,
                            city: user_detail.adress_city,
                            country: 'Turkey',
                            address: `${user_detail.adress} ${user_detail.adress_district}/${user_detail.adress_city}`,
                        },
                        basketItems: basketItems
                    };
                    iyzipay.checkoutFormInitialize.create(request, function (err, result) {
                        console.log(result);
                        if (err) throw err;
                        res.redirect(result.paymentPageUrl + "&iframe=true")
                    });

                })
        })
    }
    // giriş yapılmadı ise ;
    else {
        res.redirect("/users/login")
    }
})



module.exports = router;
