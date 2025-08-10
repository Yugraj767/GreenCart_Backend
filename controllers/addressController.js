const Address = require('../models/Address');


// Add  Address : /api/address/add  To add a new address
const addAddress = async(req,res) =>{
      try{
            const address = req.body.address || req.body;
            const userId = req.user.id;; 
           await Address.create({...address,userId});
           return res.json({success:true, message:"Address added Successfully"});
      } catch(error){

            console.log(error.message);
            return res.json({success:false , message: error.message});

      }
}

//Controller function to display list of addresses
//Get all addresses : /api/address/list

const getAddress = async (req,res) =>{
      try {
             const userId = req.user.id;// ✅ Securely extracted from auth middleware

            const addresses =await Address.find({userId});
            return res.json({success:true, addresses});
      } catch (error) {
            console.log(error.message);
            return res.json({success:false , message: error.message});
      }
}

module.exports = {addAddress,getAddress};
