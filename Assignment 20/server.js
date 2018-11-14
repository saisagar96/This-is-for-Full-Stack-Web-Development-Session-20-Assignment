var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var mongoose = require('mongoose');
var product = require('./product');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8090;
var router = express.Router();


app.use(cors());
app.use('/api', router);    
app.listen(port);
console.log('REST API is runnning at ' + port);

mongoose.connect('mongodb://localhost:27017/product');

router.use(function (req, res, next) {
    // do logging 
    // do authentication 
    console.log('Logging of request will be done here');
    next(); // make sure we go to the next routes and don't stop here
});

// Creating a new record
router.route('/products').post(function (req, res) {
    var p = new product(req);
    p.title = req.body.title;
    p.price = req.body.price;
    p.instock = req.body.instock;
    p.photo = req.body.photo;
    console.log(req.body);
    
    p.save(function (err) {
        if (err) { // Display error
            res.send(err);
        }
        res.send({ message: 'Product Created !' })
    })
});
 
router.route('/products').get(function (req, res) {
    product.find(function (err, products) {
        if (err) {// Display error
            res.send(err);
        }
        res.send(products);
    });
});

router.route('/products/:id').get(function (req, res) {


    product.findById(req.params.id, function (err, prod) {
        if (err) // Display error
            res.send(err);
        res.json(prod);
    });
});

router.route('/products/:id').put(function (req, res) {

    product.findById(req.params.id, function (err, prod) {
        if (err) { // Display error
            res.send(err);
        }
        prod.title = req.body.title;
        prod.price = req.body.price;
        prod.instock = req.body.instock;
        prod.photo = req.body.photo;
        prod.save(function (err) {
            if (err) // Display error
                res.send(err);

            res.json({ message: 'Product updated!' });
        });

    });
});

router.route('/products/:id').delete(function (req, res) {

    product.remove({ _id: req.param.id }, function (err, prod) {
        if (err) { // Display error
            res.send(err);
        }
        res.json({ message: 'Successfully deleted' });
    })

});