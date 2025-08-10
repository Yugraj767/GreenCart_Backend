const jwt = require('jsonwebtoken');
require('dotenv').config();
const {authSeller}=require('../middlewares/authSeller');

//Login Seller : /api/seller/login

const sellerLogin = async(req,res) =>{
  
  try{
            const {email,password}= req.body;


      if(password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL){
            //Genarting the tokens
            const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn:'7d'})

            //After generating the tokens we have to set this token into cookies
              res.cookie('sellerToken',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
         
            sameSite:process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge: 7*24*60*60*1000,
           });

            //After that send the cookies in the response.
            
            return res.json({success: true, message:'Seller Login Successfull'});

      }
      else{
             
            return res.json({success: false, message:'Invalid Email or Password'});
      }
  } catch(error){
       
      console.log(error.message);
      return res.json({success: false ,message: error.message});
  }


}

// check isAuth : /api/seller/is-auth

const isSellerAuth= async (req,res)=>{

      try{
           
            return res.json({success:true});

      } catch(error){

       console.log(error.message)  
          res.json({success:false,message:'Something went wrong'})
      }

}


//Logout seller : /api/seller/logout

const sellerLogout= async (req,res) =>{

      try{
         
            res.clearCookie('sellerToken',{
                  httpOnly:true,
                  secure:process.env.NODE_ENV === 'production',
                  sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'strict'
            });

            return res.json({success:true, message:"Logged Out"})
      }
      catch(error){
              console.log(error.message)  
          res.json({success:false,message:'Something went wrong'})
      }

      
}

module.exports= {sellerLogin,isSellerAuth,sellerLogout};