
const cloudinary = require("../configs/cloudinary");
const streamifier = require('streamifier');
const Product = require('../models/Product');

const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

 //Add Product : /api/product/add
const addProduct = async (req, res) => {
  try {
    let productData = JSON.parse(req.body.productData);
    const images = req.files;

    if(!images || images.length === 0){
      return res.json({success:false, message:"No images uploaded"});
    }

    let imageUrl = await Promise.all(
      images.map(async (item) => {
        let result = await uploadFromBuffer(item.buffer);
        return result.secure_url;
      })
    );

    const created = await Product.create({ ...productData, image: imageUrl });

    return res.json({ success: true, message: 'Product Added', product: created });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};









//Get Product : /api/product/list

const productlist = async(req,res) =>{
   
      try{
            //return all the product
            const products =await Product.find({});
            return res.json({success:true, products:products})


      } catch(error){
             console.log(error.message);
            return res.json({success:false, message:error.message});
      }

}


//Get Single Product : /api/product/id

const productById =async(req,res)=>{

      try{
          
            const {id}= req.body;

            const product =await Product.findById(id);
            return res.json({success:true, product:product})
      }
      catch(error){
             console.log(error.message);
            return res.json({success:false, message:error.message});
      }

}

//Get Product inStock : /api/product/stock

const changeStock = async (req,res) =>{
   try{
       const {id,inStock} = req.body;
          
       await Product.findByIdAndUpdate(id,{$set:{inStock}});
       return res.json({success:true, message:'Stock Updated'});
         
   } catch(error){
             console.log(error.message);
            return res.json({success:false, message:error.message});
   }
}

module.exports = {productlist,productById,changeStock,addProduct};


