const express = require("express")
const router = express.Router()
const database = require('../database');


router.get('/', (req, res) => {

    database.query("SELECT p.*, b.brand FROM product p, brands b Where b._id = p.brandid ORDER BY _id DESC", function (err, result) {
        if (err) throw err;
        res.render("index", { products: result })
    })
})

router.get('/product/:id', (req, res) => {

    database.query(" SELECT p.*, b.brand FROM product p, brands b Where b._id = p.brandid AND p._id = ?;",[parseInt(req.params.id)], function (err, product) {
        if (err) throw err;
        
        console.log(product)

        database.query("SELECT a.OzAdi, a.OzDegeri FROM attribute a Where a.ProductId = ?",[parseInt(req.params.id)], function (err, attributes) {
            if (err) throw err;
            console.log(attributes)
            res.render("product", { product: product[0], attributes: attributes })
        })

        
    })

})

router.get("/products/search", function (req, res) {
    if (req.query.search) {
        //Akıllı Arama
        database.query(`SELECT
        *
      FROM product
      inner JOIN categories ON categories._id = product.categoryid
      inner JOIN brands ON brands._id = product.brandid
      WHERE
        MATCH(categories.category) AGAINST(?) OR
        MATCH(brands.brand) AGAINST(?) OR
        MATCH(product.name) AGAINST(?);`,[req.query.search,req.query.search,req.query.search],
     function (err, result) {
        if (err) throw err;
        res.render("products", { products: result, title: req.query.search })
    })

    }
});


router.get('/products/category/:category', (req, res) => {

    database.query("SELECT p.*, b.brand FROM product p, brands b   Where b._id = p.brandid AND p.categoryId = (Select c._id FROM categories c Where category = ?) ORDER BY _id DESC",[req.params.category],
     function (err, result) {
        if (err) throw err;
        res.render("products", { products: result, title: "Kampanyalı Ürünler" })
    })

})

router.get('/products/campaign', (req, res) => {

    database.query("SELECT p.*, b.brand FROM product p, brands b Where b._id = p.brandid AND p.discount = 1 ORDER BY _id DESC", function (err, result) {
        if (err) throw err;
        res.render("products", { products: result, title: "Kampanyalı Ürünler" })
    })

})



module.exports = router