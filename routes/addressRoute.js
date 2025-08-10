
const express =require('express');
const { authUser } = require('../middlewares/authUser');
const { addAddress, getAddress } = require('../controllers/addressController');

const addressRouter = express.Router();

addressRouter.post('/add',authUser,addAddress);
addressRouter.get('/get',authUser,getAddress);

module.exports= addressRouter;