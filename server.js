const express = require("express")
const app = express()
const mongoose = require("mongoose");
const { populate } = require("./model/product");
const product = require("./model/product");
app.use(express.json());
mongoose.connect("mongodb://127.0.0.1/mydb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if (err) {
        console.log("got error")
    }
    else {
        console.log("working fine")
    }
})

app.listen(3004, function () {
    console.log("server listening on port 3004")
})

app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET");
    next();
});
//schema
// const Schema = {
//     name:String,
//     email:String,
//     id:Number
// }
// const SchemaModel = mongoose.model('/empdata',Schema)
var Product = require('./model/product')
var WishList = require('./model/wishlist')

app.post('/product', async (req, res) => {
    console.log("Data posted inside app.post method")

    const data = new Product({
        title: req.body.title,
        price: req.body.price,
        likes: req.body.likes
    }
    )
    const val = await data.save();
    res.json(val);
})



app.get('/product', (req, res) => {
    Product.find({}, function (err, productvalues) {
        if (err) {
            console.log(err)
            res.send(err)
        }
        else
            res.send(productvalues)
    })
})

app.get('/wishlist', function (req, res) {
    WishList.find({}).populate({path:'products', model: 'Detail'}).exec(function(err,wishLists){
        if(err){
            res.send("Could fetch wishlist")
        }else{
            res.send(wishLists)
        }
    }) //path:'products' value is from wishlist.js file which we want to populate which belongs to Detail collection from product.js Model

})

app.post('/wishlist', function (req, res) {
    var wishlist = new WishList()
    wishlist.title = req.body.title

    wishlist.save(function (err, wishlistValues) {
        if (err) {
            res.status(500).send(`The error was ${err}`)
        } else
            res.send(wishlistValues)
    })
})


//used to create a list of products in wishlist using productId and wishlistId
app.put('/wishlist/product/add', function (request, response) {
    Product.findOne({ _id: request.body.productId }, function (err, product) {  //products:product._id where products is an object in wishlist.js  
        if (err) {
            response.status(500).send(`The error was ${err}`)
        } else {
            WishList.updateOne({ _id: request.body.wishListId }, { $addToSet: { products: product._id } }, function (err, wishlist) {
                if (err) {
                    response.status(500).send(`The error was ${err}`)
                } else {
                    response.send(wishlist)
                }
            })
        }
    })
})