const express = require('express');
const { register,Login,isAuth,logout}  = require('../controllers/userController');
const { authUser } = require('../middlewares/authUser');

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login',Login);
userRouter.get('/is-auth',authUser,isAuth);
userRouter.post('/logout',authUser,logout);

module.exports = userRouter;