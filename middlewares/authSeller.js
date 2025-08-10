
const jwt= require('jsonwebtoken');
require('dotenv').config();

const authSeller = async(req,res,next)=>{

       //we will get cookies from the request  then from cookies we will extract token from cookies
      const {sellerToken}= req.cookies;

      //Seller token is not available inn cookies
      if(!sellerToken){
              
            return res.json({success:false,message:'Not authorized'});
      }

      //if token is available in cookies
            try{
                   const tokenDecode =  jwt.verify(sellerToken,process.env.JWT_SECRET);
      
                   if(tokenDecode.email=== process.env.SELLER_EMAIL){
                      return next();
                   }
                   else{
                        return res.json({success:false, message: 'Not Authorized'});
                   }
      
                   //It is used to pass the user id to the next controller functiona
                   
      
            } catch(error){
               
                return   res.json({success:false, message: error.message});
      
            }


}

module.exports={authSeller};