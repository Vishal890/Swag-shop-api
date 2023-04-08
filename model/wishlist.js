var mongoose = require('mongoose')

var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

const WishList = new Schema({
    title: { type: String, default: "product" },
    products: [{ type: ObjectId, ref: 'Product' }]

})

module.exports = mongoose.model('Wishlist',WishList)