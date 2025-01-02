import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import testimonialRoutes from './routes/testimonailRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import payRoutes from './routes/payRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import comboRoutes from './routes/comboRoutes.js';
import gifRoutes from './routes/gifRoutes.js';
import dlvryRoutes from './routes/dlvryRoutes.js';
import shpRtRoutes from './routes/shpRtRoutes.js';

dotenv.config();
const app = express()

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('DB Connection Sucessfull'))
    .catch((err) => {
        console.log(err);
    })

app.use(cors());
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use("/api/products", productRoutes);
app.use("/api/combo", comboRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/complete", stripeRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/testimonails", testimonialRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/paylink", payRoutes);
app.use("/api/gif", gifRoutes);
app.use("/api/dlvry", dlvryRoutes);
app.use("/api/shprkt", shpRtRoutes)

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
    const KEY = process.env.STRIPE_KEY
    // console.log("key", KEY);

    console.log('Backend server is running', PORT)
})