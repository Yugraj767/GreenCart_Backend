
const express = require('express');
const { authUser } = require('../middlewares/authUser');
const { placeOrderCOD, getUserOrders, getAllOrders, placeOrderStripe } = require('../controllers/orderController');
const { authSeller } = require('../middlewares/authSeller');
const orderRouter = express.Router();

orderRouter.post('/cod',authUser,placeOrderCOD);
orderRouter.post('/stripe',authUser,placeOrderStripe);
orderRouter.get('/user',authUser,getUserOrders);
orderRouter.get('/seller',authSeller, getAllOrders);

module.exports = orderRouter;