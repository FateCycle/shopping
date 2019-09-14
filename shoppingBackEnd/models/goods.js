var mongoose=require('mongoose')
var Schema=mongoose.Schema;

var GoodSchme=new Schema({
    productId : String, 
    productName : String, 
    salePrice : Number, 
    productImage : String, 
    productUrl : String,
    checked: Boolean,
    productNum:Number,
});

module.exports=mongoose.model('Good',GoodSchme);

