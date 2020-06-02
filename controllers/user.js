const User = require('../models/users.js')
const Order = require('../models/order.js');

exports.getUserById = (req,res,next,id) => {
    User.findById(id).exec((err,user) => {
        if(err||!user){
            res.status(400).json({
                err:'No user found'
            });
        }
        req.profile = user;
        next();
    });
}

exports.getUser = (req,res) => {

    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile);
}

exports.updateUser = (req,res) => {
    User.findByIdandUpdate(
        {_id:req.profile._id},
        {$set:req.body},
        {$new:true,useFindAndModify:false},
        (err,user) => {
            if(err){
                return res.status(400).json({
                    error:"You are not authorized to update this user"
                });
            }
            user.salt = undefined;
            user.encry_password = undefined;
            user.createdAt = undefined;
            user.updatedAt = undefined;
            res.json(user)
        }
    )
}

exports.userPurchaseList = (req,res) => {
    Order.find({user:req.profile._id})
     .populate("user","_id name email")
     .exec((err,order) => {
         if(err){
             return res.status(400).json({error:"NO order in this account"});
         }
         return res.json(order);
     })
}

exports.pushOrderInPurchaseList = (req,res,next) => {
    
    purchases = []
    req.body.products.forEach(product => {
        purchases.push({
            _id:product._id,
            name:product.name, 
            description:product.description,
            category:product.category,
            quantity:product.quantity,
            amount:req.body.order.amount,
            transaction_id:req.body.order.transaction_id
        })
    });

    User.findOneAndUpdate(
        {_id:req.profile._id},
        {$push:{purchases:purchases}},
        {new:true},
        (err,purchases) => {
            if(err){
                return res.status(400).json({
                    error:"Unable to save"
                })
            }
        }
    )
    next();
}