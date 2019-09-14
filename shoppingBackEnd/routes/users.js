var express = require('express');
var router = express.Router();
const Users=require('../models/users');
require('../util/Date');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/login',(req,res,next)=>{
  let userName=req.body.userName;
  let userPwd=req.body.userPwd;
  console.log(userName);
  console.log(userPwd);
  Users.findOne({userName:userName,userPwd:userPwd}).exec((err,doc)=>{
      if(err){
        res.json({status:0,msg:'server error'});
        return;
      }
      if(!doc){
        res.json({status:0,msg:'用户名密码错误'});
        return;
      }
      if(doc){
        res.cookie('user',{
          userId:doc.userId,
          userName:doc.userName
        },{
          path:'/',
          maxAge:60*60*1000,
        });
        res.json({status:1,msg:'成功',result:doc})
      }
  });

})


router.post('/logout',(req,res,next)=>{
  res.clearCookie('user');
  res.json({
    status:'0',
    msg:'success',
  })
})

router.get('/checkLogin',(req,res,next)=>{
  if(!req.cookies.user){
    res.json({
      status:0,
      msg:'请先登录',
      result:'',
    })
    return;
  }
  res.json({
    status:1,
    msg:'用户已经登录',
    result:req.cookies.user,
  })
})

router.get('/cartList',(req,res,next)=>{
  let userId=req.cookies.user.userId;
  if(!userId){
    res.json({
      status:0,
      msg:'请登录',
      result:''
    });
    return;
  }
  Users.findOne({userId:userId}).exec((err,docs)=>{
    if(err) res.json({
      status:0,
      msg:'服务器错误',
      result:''
    });
    else if(!docs) res.json({
      status:0,
      msg:'用户不存在',
      result:'',
    })
    else res.json({
      status:0,
      msg:'成功',
      result:docs.cartList,
    })
  })
});

router.delete('/cart/del',(req,res,next)=>{
  let productId=req.body.productId;
  let userId=req.cookies.user.userId;
  if(userId){
  Users.updateOne({userId:userId},{$pull:{cartList:{productId:productId}}}).exec((err,docs)=>{
    if(err){
      res.json({status:0,msg:'server error'});
      return;
    }
    if(!docs){
      res.json({status:0,msg:'用户不存在'});
      return;
    }
    res.json({
      status:1,
      msg:'delete success',
      result:''
    })

  })
}else
  res.json({
    status:0,
    msg:'请登录',
    result:''
  })

})


router.put('/cart/edit',(req,res,next)=>{
  item=req.body;
  let userId=req.cookies.user.userId;
  Users.updateOne({userId:userId,"cartList.productId":item.productId},{
    //"cartList.$.productNum":item.productNum,
    "cartList.$":item
  }).exec((err,docs)=>{
    if(err){
      res.json({status:0,msg:'server error',result:''});
      return;
    }
    res.json({
      status:1,
      msg:'server error',
      result:docs
    })
  })
})

router.put('/cart/editAll',(req,res,next)=>{
  let curToggleAllCheck=req.body.curToggleAllCheck;
  let userId=req.cookies.user.userId;
  console.log(curToggleAllCheck);
  Users.findOne({userId:userId}).then(docs=>{
    docs.cartList.forEach(elem=>{
      elem.checked=curToggleAllCheck;
    });
    docs.save((err,docs)=>{
      if(err){
        res.json({status:0,msg:'server error',result:''});
        return;
      }
      res.json({
        status:1,
        msg:'success',
        result:docs
      })
    });

  });
})

router.get('/addressList',(req,res,next)=>{
  userId=req.cookies.user.userId;
  Users.findOne({userId:userId},"addressList").exec((err,docs)=>{
    if(err){
      res.json({
        status:0,
        msg:'server error',
        result:[]        
      })
      return;
    }
    res.json({
      status:1,
      msg:'success',
      result:docs
    })
  })
})


router.put('/address/setDefault',(req,res,next)=>{
  let addressId=req.body.addressId;
  userId=req.cookies.user.userId;
  Users.findOne({userId:userId}).then(docs=>{
    if(!docs){
      res.json({
        status:0,
      msg:'查无此人',
      result:''
      })
      return;
    }

    for(let elem of  docs.addressList){
      if(elem.addressId===addressId){
        console.log(elem);
        elem.isDefault=true;
      }
      else elem.isDefault=false;
    }
    docs.save((err,docs)=>{
      if(err){
        res.json({
          status:0,
          msg:'server error',
          result:''
        })
        return;
      }
      res.json({
        status:1,
          msg:'success',
          result:''
      })
    })
  }).catch(err=>{
    res.json({
      status:0,
      msg:'server error',
      result:''
    })
  })
})


router.delete('/address/del',(req,res,next)=>{
  let addressId=req.body.addressId;
  let userId=req.cookies.user.userId;
  Users.updateOne({userId:userId},{$pull:{addressList:{addressId:addressId}}}).exec((err,docs)=>{
    if(err){
      res.json({status:0,msg:'server error'});
      return;
    }
    if(!docs){
      res.json({status:0,msg:'用户不存在'});
      return;
    }
    res.json({
      status:1,
      msg:'delete success',
      result:''
    })
  });
});


router.get('/checkCartList',(req,res,next)=>{
  let userId=req.cookies.user.userId;
  if(!userId){
    res.json({
      status:0,
      msg:'请先登录',
      result:''
    });
    return;
  }
  Users.findOne({userId:userId}).select('cartList').exec((err,docs)=>{
    if(err){
      res.json({status:0,msg:'server error'});
      return;
    }
    let checkCartList=[];
    docs.cartList.forEach(elem=>{
      if(elem.checked)
        checkCartList.push(elem);
    })
    res.json({
      status:1,
      msg:'success',
      result:checkCartList
    })
  })
})

router.post('/payment',(req,res,next)=>{
  let totalPrice=req.body.totalPrice;
  let addressId=req.body.addressId;
  let userId=req.cookies.user.userId;
  let orderitem={}
  if(!userId){
    res.json({
      status:0,
      msg:'请先登录',
      result:''
    });
    return;
  }

  Users.findOne({userId:userId}).then(docs=>{
    if(!docs){
      res.json({
        status:0,
        msg:'用户不存在',
        result:''
      });
      return;
    }
    let checkCartList=docs.cartList.filter(elem=>elem.checked);
    let address=docs.addressList.find((elem)=>elem.addressId===addressId);
    orderitem.addressInfo=address;
    orderitem.orderTotal=totalPrice;
    orderitem.goodsList=checkCartList;
    orderitem.createDate=new Date().Format('yyyy-MM-dd hh:mm:ss');
    let systime=new Date().Format('yyyyMMddhhmmss');
    let platform='622';
    let r1=Math.floor(Math.random()*10)
    let r2=Math.floor(Math.random()*10);
    orderitem.orderId=platform+r1+systime+r2;
    docs.orderList.push(orderitem);
    docs.save((err,docs)=>{
      if(err){
        res.json({
          status:0,
          msg:'server error',
          result:''
        });
        return;
      }
      res.json({
        status:0,
        msg:'create order successlly',
        result:{
          orderId:orderitem.orderId,
          orderTotal:orderitem.orderTotal,
        }
      });
      return;
    })
  })
})


router.get('/orderDetail',(req,res,next)=>{
  let userId=req.cookies.user.userId;
  let orderId=req.query.orderId;
  Users.findOne({userId:userId}).exec((err,docs)=>{
    if(err){
      res.json({
        status:0,
        msg:'server error',
        result:''
      });
      return;
    }
    if(docs.orderList.length===0){
      res.json({
        status:0,
        msg:'未创建订单',
        result:''
      })
      return;
    }
    item=docs.orderList.find((elem)=>elem.orderId===orderId);
    item?res.json({status:1,msg:'success',result:{
      orderId:item.orderId,
      orderPrice:item.orderTotal
    }}):res.json({status:0,msg:'没有此订单',result:''})

  });
});



router.get('/getCartCount',(req,res,next)=>{
  let userId=req.cookies.user.userId;
  if(!userId){
      res.json({
        status:0,
        msg:'先登录',
        result:''
      });
      return;
  }
  Users.findOne({userId:userId}).exec((err,docs)=>{
    if(err){
      res.json({
        status:0,
        msg:'server error',
        result:''
      });
      return;
    }
    if(!docs){
      res.json({
        status:0,
        msg:'用户不存在',
        result:''
      });
      return;
    }
    let cartCount=0;
    docs.cartList.forEach(elem=>{
      cartCount+=elem.productNum;
    })
    res.json({
      status:1,
      msg:'success',
      result:cartCount
    })
  })

})
module.exports = router;
