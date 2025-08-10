
const express = require('express');
const upload = require('../configs/multer');
const { authSeller } = require('../middlewares/authSeller');
const { addProduct, productlist, productById, changeStock } = require('../controllers/productController');

const productRouter = express.Router();

productRouter.post('/add', authSeller, upload.array('images', 4), addProduct); // Note the order of middlewares

productRouter.get('/list', productlist);
productRouter.get('/id', productById);
productRouter.post('/stock', authSeller, changeStock);

module.exports = productRouter;
