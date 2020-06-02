const {Order,ProductCart} = require('../models/order');

exports.getOrderById = (req,res,next,id) => {
    Order.findBy('id')
    .populate("products.product","name price")
    .exec((err,order) =>{
        if(err){
            return res.status(400).json({
                err:'Cannot get orderid'
            })
        }
        req.order=order;
        next()
    });
}