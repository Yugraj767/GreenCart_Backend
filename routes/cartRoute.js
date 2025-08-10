
const express  = require('express');
const { authUser } = require('../middlewares/authUser');
const updateCart = require('../controllers/cartController');

const cartRouter = express.Router();

cartRouter.post('/update',authUser,updateCart);

module.exports = cartRouter;