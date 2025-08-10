
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  
      // ref: 'user' means you're referencing the Mongoose model named 'user'.
      userId :{type:mongoose.Schema.Types.ObjectId , required:true, ref: 'user'},

      items : [{
            product : {type:mongoose.Schema.Types.ObjectId,required:true, ref:'product'},

            quantity:{type:Number,required:true}
      }],

      amount : {type:Number , required:true},
      address :{type:mongoose.Schema.Types.ObjectId , required:true, ref:'address'},
      status :{ type:String ,default:'Order Placed'},
      paymentType : {type:String ,required:true},
      isPaid:{type:Boolean ,required:true,default:false},
},{timestamps: true});
 
const Order = mongoose.models.order || mongoose.model('order',orderSchema);

module.exports = Order;