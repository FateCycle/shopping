const express=require('express');
const mongoose=require('mongoose');
const Goods=require('../models/goods');
const Users=require('../models/users');

mongoose.connect('mongodb://localhost/demo',{ useNewUrlParser: true });

var db = mongoose.connection;

db.on('connected',()=>{
    console.log('connect');
});

db.on('error',()=>{
    console.log('error');
});

db.on('disconnected',()=>{
    console.log('disconnected');
});

var router=express.Router();
router.get('/',(req,res,next)=>{
    //Goods.find().exec((err,docs)=>console.log(docs));
    let pageSize=parseInt(req.query.pageSize);
    let page=parseInt(req.query.page);
    let sort=parseInt(req.query.sort);
    let num=req.query.num;
    let skip=(page-1)*pageSize;
    let parms={};
    console.log(num);
    if(num!=='all'){
        parms.salePrice={
            $gt:parseInt(req.query.gtPrice),
            $lt:parseInt(req.query.ltPrice),
        }
    }
    Goods.find(parms).skip(skip).limit(pageSize).sort({'salePrice':sort}).then((docs,err)=>{
        if(err){
            res.json({
                status:1,
                msg:err.msg,
            });
            return;
        }
        res.json({
            status:0,
            msg:'',
            result:{
                count:docs.length,
                list:docs,
            }
        });
    });
});
router.post('/addCart',(req,res,next)=>{
     let userId=req.cookies.user.userId;
     let productId=req.body.productId;
     Users.findOne({userId:userId}).exec((err,user)=>{
         if(err) res.json({status:1,msg:'内部错误'});
         else if(!user) res.json({status:1,msg:'查无此人'});
         if(user.cartList.length>0){
            for(item of user.cartList){

                if(item.productId===productId){
                    item.productNum++;
                    user.save(err=>console.log(err));
                   res.json({
                       status:0,
                       msg:'数量+1'
                   });
                   return;
                   
                }
            }
        }
            Goods.findOne({productId:productId}).exec((err,goods)=>{
                console.log(productId);
                if(err) res.json({status:1,msg:'内部错误'});
                else if(!goods) res.json({status:1,msg:'无此商品'});
                else{
                    goods.checked=true;
                    goods.productNum=1;
                    user.cartList.push(goods);
                    
                    user.save(err=>{
                        if(err) res.json({status:0,msg:'内部错误'})
                        else res.json({status:1,msg:'新增+1'})
                })
            }
        })
     })
     
     
});


module.exports=router;