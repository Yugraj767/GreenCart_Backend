const User = require("../models/User");

//update User CartData : /api/cart/update
const updateCart = async(req,res)=>{
       
      try{
            const {cartItems} = req.body;
            const userId = req.userId;
           
            await User.findByIdAndUpdate(userId,{$set:{cartItems}});

            return res.json({success:true, message:"Cart Updated"});   
      } catch(error){

            console.log(error.message);
            return res.json({success:false, message:error.message});

      }

}

module.exports= updateCart;