const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    userId:String,
    userName:String,
    userPwd:String,
    orderList:Array,
    cartList: [{
        productId:String,
        productName:String,
        productNum:Number,
        productImage:String,
        salePrice:String,
        checked:Boolean
    }],
    addressList:[{
        addressId : String, 
        userName : String, 
        streetName : String, 
        postCode : String, 
        tel : String,
        isDefault:Boolean
    }]
})

module.exports=mongoose.model('User',userSchema);