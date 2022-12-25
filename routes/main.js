const express = require("express")
const router = express.Router()
const Product = require("../models/product")

router.get('/', (req, res) => {
    Product.find({}).sort({ $natural: -1 }).lean().then(products => {
        res.render("index", { products: products })
    });

})

router.get('/product/:id', (req, res) => {
    Product.findById(req.params.id).lean().then(product => {
        res.render("product", { product: product })
    });
})


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

router.get("/products/search", function (req, res) {
    if (req.query.search) {

        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        var products = [];


        Product.find({ name: regex }).sort({ $natural: -1 }).lean().then(prds => {
            let products = [];
            prds.forEach(prd => {
                products.push(prd)
            });
            if (products.length > 0)
                res.render("products", { products: products, title: req.query.search })
            else {
                Product.find({ brand: regex }).sort({ $natural: -1 }).lean().then(prds => {
                    let products = [];
                    prds.forEach(prd => {
                        products.push(prd)
                    });
                    if (products.length > 0)
                        res.render("products", { products: products, title: req.query.search })
                    else {
                        Product.find({ category: regex }).sort({ $natural: -1 }).lean().then(prds => {
                            let products = [];
                            prds.forEach(prd => {
                                products.push(prd)
                            });

                            res.render("products", { products: products, title: req.query.search })

                        });
                    }
                });
            }
        });

    }
});

router.get('/products/category/:category', (req, res) => {

    Product.find({ category: req.params.category }).sort({ $natural: -1 }).lean().then(products => {

        res.render("products", { products: products, title: req.params.category })

    });

})

router.get('/products/campaign', (req, res) => {

    Product.find({ discount : true }).sort({ $natural: -1 }).lean().then(products => {

        res.render("products", { products: products, title: req.params.category })

    });

})



module.exports = router
