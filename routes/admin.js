const express = require("express")
const router = express.Router()
const cloudinary = require('cloudinary').v2
const fs = require("fs")
const database = require('../database');


router.get('/urun-ekle', (req, res) => {

    if (req.session.userId) {

        database.query("SELECT * FROM user Where _id = ?", [req.session.userId], function (err, result) {
            if (err) throw err;
            var user = result[0]
            if (user.admin == true) {
                database.query("SELECT * FROM brands", function (err, result) {
                    if (err) throw err;
                    var brands = result
                    database.query("SELECT * FROM categories", function (err, result) {
                        if (err) throw err;
                        var categories = result
                        res.render('admin/urun-ekle', { user: user, brands: brands, categories, categories })
                    })
                })
            }
            else
                res.redirect("/account/uyelik-bilgilerim")
        })
    }
})

// router.post('/urun-ekle/add-prd', (req, res) => {

//     if (req.session.userId) {

//         User.findById(req.session.userId).lean().then(user => {
//             if (user.admin == true) {
//                 // image alındı ve ismi unique yapıldı

//                 let prd_image = req.files.prd_image
//                 prd_image_type = prd_image.mimetype.split("/")
//                 prd_image.name = `${new Date().getTime()}.${prd_image_type[1]}`

//                 var image_url;


//                 const addProduct = async () => {
//                     const result = await cloudinary.uploader.upload(
//                         prd_image.tempFilePath, {
//                         use_filename: true,
//                         folder: "allhere"
//                     }
//                     );
//                     image_url = result.secure_url;



//                     // gelen ürün özellikleri obje haline getirilip diziye eklendi
//                     var attr_array = []

//                     for (let index = 0; index < req.body.attributes.length; index += 2) {
//                         attr_obj = {}
//                         attr_obj[req.body.attributes[index]] = req.body.attributes[index + 1]
//                         attr_array.push(attr_obj)
//                     }

//                     console.log(image_url)
//                     Product.create({
//                         _id: `${new Date().getTime()}`,
//                         name: req.body.prd_name,
//                         brand: req.body.prd_brand,
//                         prddesc: req.body.prd_desc,
//                         category: req.body.prd_category,
//                         attribute: attr_array,
//                         price: req.body.prd_price,
//                         img: image_url,
//                         discount: false,

//                     }, (err, result) => {
//                         if (err) throw err;
//                         console.log(result);
//                     });
//                     fs.unlinkSync(prd_image.tempFilePath)
//                     /* prd_image.mv(path.resolve(__dirname, "../public/img", prd_image.name)) */
//                     res.redirect("/admin/urun-ekle")
//                 }

//                 addProduct()
//             }
//             else
//                 res.redirect("/account/uyelik-bilgilerim")
//         });


//     }
//     else {
//         res.redirect("/users/login")
//     }
// })

router.post('/urun-ekle/add-prd', (req, res) => {

    if (req.session.userId) {

        database.query("SELECT * FROM user Where _id = ?", [req.session.userId], function (err, result) {
            if (err) throw err;
            var user = result[0]
            if (user.admin == true) {

                // image alındı ve ismi unique yapıldı

                let prd_image = req.files.prd_image
                prd_image_type = prd_image.mimetype.split("/")
                prd_image.name = `${new Date().getTime()}.${prd_image_type[1]}`

                var image_url;

                const addProduct = async () => {
                    const result = await cloudinary.uploader.upload(
                        prd_image.tempFilePath, {
                        use_filename: true,
                        folder: "allhere"
                    }
                    );
                    image_url = result.secure_url;

                    console.log(image_url)

                    var inputs = [
                        parseInt(req.body.prd_brand),
                        parseInt(req.body.prd_category),
                        req.body.prd_name,
                        req.body.prd_desc,
                        parseFloat(req.body.prd_price),
                        image_url,
                        false
                    ]

                    database.query('INSERT INTO product (brandid, categoryid, name, prddesc, price,img, discount) VALUES (?); ',
                        [inputs], function (err, result) {
                            if (err) throw err;
                            var product_id = result.insertId

                            var attr_array = []
                            var attribute = []
                            for (let index = 0; index < req.body.attributes.length; index += 2) {

                                attribute = []
                                attribute = [product_id, req.body.attributes[index], req.body.attributes[index + 1]]

                                attr_array.push(attribute)
                            }

                            database.query('INSERT INTO attribute (ProductId, OzAdi, OzDegeri) VALUES ?; ',
                                [attr_array], function (err, result) {
                                    if (err) throw err;

                                    fs.unlinkSync(prd_image.tempFilePath)
                                    /* prd_image.mv(path.resolve(__dirname, "../public/img", prd_image.name)) */
                                    res.redirect("/admin/urun-ekle")

                                })
                        })

                }
                addProduct()
            }
            else
                res.redirect("/account/uyelik-bilgilerim")
        })
    }
    else {
        res.redirect("/users/login")
    }
})

/* router.get('/urun-duzenle', (req, res) => {
    if (req.session.userId) {
        User.findById(req.session.userId).lean().then(user => {
            if (user.admin == true) {
                Product.find({}).sort({ $natural: -1 }).lean().then(products => {
                    res.render("admin/urun-duzenle", { products: products })
                });
            }
            else
                res.redirect("/account/uyelik-bilgilerim")
        });


    }
    else
        res.redirect("/users/login")
}) */

router.get('/urun-duzenle', (req, res) => {
    if (req.session.userId) {
        database.query("SELECT * FROM user Where _id = ?", [req.session.userId], function (err, result) {
            if (err) throw err;
            var user = result[0]
            if (user.admin == true) {
                database.query("SELECT p.*, b.brand FROM product p, brands b Where b._id = p.brandid ORDER BY _id DESC", function (err, result) {
                    if (err) throw err;
                    res.render("admin/urun-duzenle", { products: result })
                })
            }
            else
                res.redirect("/account/uyelik-bilgilerim")
        
        })


    }
    else
        res.redirect("/users/login")
})

/* router.delete("/urun-duzenle/delete-prd/:id", (req, res) => {
    Product.findByIdAndDelete(
        { _id: req.params.id },
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("ürün silindi");
            }
        });
    res.redirect("/admin/urun-duzenle")
}) */

router.delete("/urun-duzenle/delete-prd/:id", (req, res) => {
    if (req.session.userId) {
        database.query("SELECT * FROM user Where _id = ?", [req.session.userId], function (err, result) {
            if (err) throw err;
            var user = result[0]
            if (user.admin == true) {
                database.query('DELETE FROM attribute where ProductId = ?', [parseInt(req.params.id)], function (err, result) {
                    if (err) throw err;
                    else {
                        database.query('DELETE FROM product where _id = ?', [parseInt(req.params.id)], function (err, result) {
                            if (err) throw err;
                            else {
                                res.redirect("/admin/urun-duzenle")
                            }
                        })
                    }
                })
            }
            else
                res.redirect("/account/uyelik-bilgilerim")
        })
    }
    else
        res.redirect("/users/login")
})

/* router.get('/urun-duzenle/:id', (req, res) => {
    Product.findById(req.params.id).lean().then(product => {
        console.log(product.attribute)
        res.render("admin/urun-ekle", { product: product, attributes: product.attribute })
    });
}) */

router.get('/urun-duzenle/:id', (req, res) => {
    if (req.session.userId) {
        database.query("SELECT * FROM user Where _id = ?", [req.session.userId], function (err, result) {
            if (err) throw err;
            var user = result[0]
            if (user.admin == true) {
                database.query(" SELECT p.*, b.brand FROM product p, brands b Where b._id = p.brandid AND p._id = ?;",[parseInt(req.params.id)], function (err, product) {
                    if (err) throw err;
                    
                    console.log(product)
            
                    database.query("SELECT a.OzAdi, a.OzDegeri FROM attribute a Where a.ProductId = ?",[parseInt(req.params.id)], function (err, attributes) {
                        if (err) throw err;
                        console.log(attributes)
                        database.query("SELECT * FROM brands", function (err, result) {
                            if (err) throw err;
                            var brands = result
                            database.query("SELECT * FROM categories", function (err, result) {
                                if (err) throw err;
                                var categories = result
                                res.render("admin/urun-ekle", {user:user, brands: brands, categories: categories, product: product[0], attributes: attributes })
                            })
                        })
                        
                    })
            
                    
                })
            }
            else
                res.redirect("/account/uyelik-bilgilerim")
        })
    }
    else
        res.redirect("/users/login")
})

/* router.post('/urun-duzenle/update-prd/:id', (req, res) => {

    if (req.session.userId) {

        User.findById(req.session.userId).lean().then(user => {
            if (user.admin == true) {

                Product.findOneAndUpdate(
                    { _id: `${req.params.id}` },
                    {
                        $set: {
                            name: req.body.prd_name,
                            brand: req.body.prd_brand,
                            prddesc: req.body.prd_desc,
                            category: req.body.prd_category,
                            price: req.body.prd_price,
                            discount: false
                        }
                    },
                    function (error, success) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log("Ürün Güncellendi !");
                        }
                    });

                res.redirect("/admin/urun-duzenle")
            }
            else
                res.redirect("/account/uyelik-bilgilerim")
        });


    }
    else {
        res.redirect("/users/login")
    }
}) */

router.post('/urun-duzenle/update-prd/:id', (req, res) => {

    if (req.session.userId) {

        database.query("SELECT * FROM user Where _id = ?", [req.session.userId], function (err, result) {
            if (err) throw err;
            var user = result[0]
            if (user.admin == true) {

                database.query("UPDATE product SET brandid= ?, categoryid=?, name=?, prddesc=?, price=?, discount=false WHERE _id = ?", [parseInt(req.body.prd_brand), parseInt(req.body.prd_category),req.body.prd_name,req.body.prd_desc,req.body.prd_price,parseInt(req.params.id)], function (err) {
                    if (err) throw err;
                    res.redirect("/admin/urun-duzenle")
                })
            }
            else
                res.redirect("/account/uyelik-bilgilerim")
        });
    }
    else {
        res.redirect("/users/login")
    }
})

module.exports = router;