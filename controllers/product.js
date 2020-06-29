const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

exports.getProductById = (req,res,id,next) => {
    Product.findById(id).exec((err,prod) => {
        if(err){
            return res.status(400).json({error:'Cannot find Product'});
        }
        req.product = prod;
        next();
    });
}

exports.createProduct = (req,res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true

    form.parse(req,(err,fields,file) => {
        if(err){
            return res.status(400).json({err:'Problem with fields'});
        }

        const {name,description,price,category,stock} = fields;

        if(!name || !description || !price || !category || !stock){
            return res.status(400).json({err:'Please Include all fields'});
        }
        const product = new Product(fields);

        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({err:'File size too big'});
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        product.save((err,product) => {
            if(err){
                return res.status(400).json({err:'Saving Tshirt in DB failed'});
            }
            res.json(product);
        })
    });
}

exports.getProduct = (req,res) => {
    req.product.photo = undefined
    return res.json(req.product);
}

exports.photo = (req,res,next) => {
    if(req.product.photo.data){
        res.set('Content-Type',req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}

exports.deleteProduct = (req,res) => {
    const product = req.product;
    product.remove((err,deletedProduct) => {
        if(err) return res.status(400).json({err:'Failed to delete'});
    });
    res.json({message:'Product Deleted'});
}

exports.updateProduct = (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
  
    form.parse(req, (err, fields, file) => {
      if (err) {
        return res.status(400).json({
          error: "problem with image"
        });
      }
  
      //updation code
      const product = req.product;
      product = _.extend(product, fields);
  
      //handle file here
      if (file.photo) {
        if (file.photo.size > 3000000) {
          return res.status(400).json({
            error: "File size too big!"
          });
        }
        product.photo.data = fs.readFileSync(file.photo.path);
        product.photo.contentType = file.photo.type;
      }
      // console.log(product);
  
      //save to the DB
      product.save((err, product) => {
        if (err) {
          res.status(400).json({
            error: "Updation of product failed"
          });
        }
        res.json(product);
      });
    });
  };
  
  //product listing
  
  exports.getAllProducts = (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 8;
    const sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  
    Product.find()
      .select("-photo")
      .populate("category")
      .sort([[sortBy, "asc"]])
      .limit(limit)
      .exec((err, products) => {
        if (err) {
          return res.status(400).json({
            error: "NO product FOUND"
          });
        }
        res.json(products);
      });
  };

  exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
      if (err) {
        return res.status(400).json({
          error: "NO category found"
        });
      }
      res.json(category);
    });
  };
  
  exports.updateStock = (req, res, next) => {
    let myOperations = req.body.order.products.map(prod => {
      return {
        updateOne: {
          filter: { _id: prod._id },
          update: { $inc: { stock: -prod.count, sold: +prod.count } }
        }
      };
    });
  
    Product.bulkWrite(myOperations, {}, (err, products) => {
      if (err) {
        return res.status(400).json({
          error: "Bulk operation failed"
        });
      }
      next();
    });
  };