
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./configs/db");
require("./configs/cloudinary"); // Just require to configure it

const userRouter = require("./routes/userRoute");
const sellerRouter = require("./routes/sellerRoute");
const productRouter = require("./routes/productRoute");
const cartRouter = require("./routes/cartRoute");
const addressRouter = require("./routes/addressRoute");
const orderRouter = require("./routes/orderRoute");
const { stripeWebhook } = require("./controllers/orderController");

const app = express();
const port = process.env.PORT || 4000;

// Allow multiple origins
// const allowedOrigins = ['http://localhost:5173'];

app.post('/stripe',express.raw({type:'application/json'}),stripeWebhook)

// Middleware configuration
app.use(express.json());
app.use(cookieParser());


app.use(cors({
  origin: ['http://localhost:5173',"https://green-cart-frontend-ten.vercel.app"],
  credentials: true,
}));

// Test Route
app.get('/', (req, res) => {
  res.send("API is Working");
});

// Routers
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

// Start server only after DB is connected
const startServer = async () => {
  try {
    await connectDB(); // Wait for MongoDB connection

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });

  } catch (error) {
    console.error("Startup Error:", error.message);
    process.exit(1); // Exit with failure
  }
};

startServer();



