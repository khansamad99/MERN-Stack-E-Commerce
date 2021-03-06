const express = require('express');
const router = express.Router();


const {getUserById} = require('../controllers/user');
const {getProductById,getAllProducts,createProduct,getProduct,getPhoto,deleteProduct,updateProduct} = require('../controllers/product');
const {isSignedIn,isAuthenticated, isAdmin} = require('../controllers/auth');

router.param('userId',getUserById);
router.param('productId',getProductById);


router.post('/product/create/:userId',isSignedIn,isAuthenticated, isAdmin,createProduct);
router.get('/product/:productId',getProduct);
router.get('/product/photo/:productId',getPhoto);
router.delete('/product/:productId/:userId',isSignedIn,isAuthenticated,isAdmin,deleteProduct);
router.put('/product/:productId/:userId',isSignedIn,isAuthenticated,isAdmin,updateProduct);
router.get("/products", getAllProducts);
module.exports = router;