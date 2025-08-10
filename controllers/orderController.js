
//Place Order COD : /api/order/cod

const { get } = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const stripe =require('stripe');
const User = require("../models/User");
require('dotenv').config();

const placeOrderCOD = async (req, res) => {
  try {
 
    const { items, address } = req.body;
     const userId = req.user?.id;

    if (!address || items.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    let total = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      total += product.offerprice * Number(item.quantity);
    }

    const amount = total + Math.floor(total * 0.02);

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });

    return res.status(201).json({ success: true, message: "Order Placed Successfully" });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//Place Order Stripe : /api/order/stripe
const placeOrderStripe = async (req, res) => {
  try {
 
    const { items, address } = req.body;
     const userId = req.user?.id;
     const origin = req.headers.origin || 'http://localhost:5173';

    if (!address || items.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }
  
    let productData =[];

    let total = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      productData.push({
            name:product.name,
            price:product.offerprice,
            quantity:item.quantity,
      })
      total += product.offerprice * Number(item.quantity);
    }

    const amount = total + Math.floor(total * 0.02);

    const order=await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });

    //Stripe Gateway Initialize 

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    // create line items for stripe

    const line_items =productData.map((item)=>{
             return {
                  price_data:{
                        currency : 'usd',
                        product_data:{
                             name : item.name, 
                        },
                        unit_amount: Math.floor( item.price*1.02*100),
                  },
                  quantity:item.quantity,
             }
    })

//Create session

const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode:"payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url :`${origin}/cart`,
      metadata:{
            orderId:order._id.toString(),
            userId,
      }

})


    return res.status(201).json({ success: true,url:session.url });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//Stripe Webhooks to verify payments Action : /stripe

const stripeWebhook = async (req,res) =>{

 //Stripe Gateway Initialize
   const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

   const sig =req.headers["stripe-signature"];
   let event;
   try {
      event=stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
      );

   } catch (error) {
      res.status(400).send(`Webhook Error : ${error.message}`)
   }

// Handle the event

switch (event.type) {
      case "payment_intent.succeeded":{
            const paymentIntent = event.data.object;
            const paymentIntentId =paymentIntent.id;

            //Getting Session Metadata
            const session = await stripeInstance.checkout.sessions.list({
                  payment_intent: paymentIntentId,
            });

            const {orderId,userId} = session.data[0].metadata;

            //Mark Payment as Paid

            await Order.findByIdAndUpdate(orderId,{isPaid:true});

            //clear user cart
            await User.findByIdAndUpdate(userId,{cartItems:{}});
            break;
      }

       case "payment_intent.payment_failed":{
            const paymentIntent = event.data.object;
            const paymentIntentId =paymentIntent.id;

            //Getting Session Metadata
            const session = await stripeInstance.checkout.sessions.list({
                  payment_intent: paymentIntentId,
            });

            const {orderId} = session.data[0].metadata;

            await Order.findByIdAndDelete(orderId);

       }
          

      default:
            console.error(`Unhandled event type ${event.type}`)
            break;
}

res.json({received:true});

}




// Get Order by User Id : /api/order/user

const getUserOrders = async (req,res) =>{
      try{
           
            const userId = req.user.id; 
            const orders = await Order.find({userId,
                  $or: [{paymentType: "COD"}, {isPaid:true}]

            }).populate("items.product address").sort({createdAt: -1});

            return res.json({success:true,orders});
      }
      catch(error){
            return res.json({success:false,message:error.message});

      }
}

//Get all order (for selle /admin):/api/order/seller


const getAllOrders = async (req,res) =>{
      try{
           
           
            const orders = await Order.find({
                  $or: [{paymentType: "COD"}, {isPaid:true}]

            }).populate("items.product address").sort({createdAt: -1});

            return res.json({success:true,orders});
      }
      catch(error){
            return res.json({success:false,message:error.message});

      }
}


module.exports ={getAllOrders,getUserOrders,placeOrderCOD,placeOrderStripe,stripeWebhook };