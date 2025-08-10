const User =require('../models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {authUser} = require('../middlewares/authUser');
require('dotenv').config();

// Register User : api/user/register

const register =async (req,res)=>{
 
      try{
            const {name,email,password}=req.body;

           if(!name || !email || !password){

             return res.json({success:false,message:'Missing Details'})
           }

           const existingUser = await User.findOne({email});

           if(existingUser){
                return res.json({success:false,message:'User Already Exists'})
           }

           const hashedPassword= await bcrypt.hash(password,10);

           const user = await User.create({
            name,email,password:hashedPassword
           });

           const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
            expiresIn:'7d'
           })

           res.cookie('token',token,{
            httpOnly:true,//prevent javascript to access cookie
            secure:process.env.NODE_ENV === "production",
            //use secure cookies in production
            sameSite:process.env.NODE_ENV === "production" ? 'none' : 'strict',//CSRF protection


            maxAge: 7*24*60*60*1000 //cookie expiration time
           });

           return res.json({
            success: true,
            message: "Registered successfully",
            user: { email: user.email, name: user.name }
         }   )

      } catch(error){
            
          console.log(error.message)  
          res.json({success:false,message:'Something went wrong'})
      }

}

// Login User : api/user/login
const Login= async (req,res)=>{
      try{
            const {email,password}=req.body;

            if(!email || !password){
                  return res.json({success:false, message:"Email and password are required"});
            }
          
            const user =await User.findOne({email});
            
            if(!user){

                  return res.json({
                        success:false,message:'Invalid Email or Password'
                  });
            }

            const isMatch = await bcrypt.compare(password,user.password);

            if(!isMatch){
             return res.json({
                        success:false,message:'Invalid Email or Password'
                  });
            }

               const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
            expiresIn:'7d'
           })

           res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
         
            sameSite:process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge: 7*24*60*60*1000,
           });

           return res.json(
            {
      success: true,
      message: "Login successful",
      user: { email: user.email, name: user.name }
    }
            // {success:true,
            // message:{email:user.email, name:user.name}}
      
      );

            

      } catch(error){

          console.log(error.message)  
          res.json({success:false,message:'Something went wrong'})
      }
}

const isAuth = async (req, res) => {
  try {

    // userId is set by authUser middleware
    const userId = req.user?.id;
    if (!userId) {
      return res.json({ success: false, message: "Not authorized" });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "Something went wrong" });
  }
};

//Logout User : /api/user/logout

const logout = async (req,res) =>{

      try{
         
            res.clearCookie('token',{
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

module.exports= {register,Login,isAuth,logout};




