const express = require('express');
const router = express.Router();


const {getUserById,pushOrderInPurchaseList} = require('../controllers/user');
const {updateStock} = require('../controllers/product');
const {} = require('../controllers/order');
const {isSignedIn,isAuthenticated, isAdmin} = require('../controllers/auth');

router.params("userId",getUserById);
router.params("orderId",getOrderById);
