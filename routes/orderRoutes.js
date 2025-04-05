import express from 'express'
const router = express.Router()
import Order from '../models/orderModel.js';
import { Product } from '../models/productModel.js'
// import User from "../models/userModel.js";

import {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} from './verifyToken.js'


//CREATE

// router.post("/", verifyToken, async (req, res) => {
// router.post("/", async (req, res) => {
//     const authHeader = req.headers.token;
//     if (authHeader) {
//         const token = authHeader.split(" ")[1];
//         const user = await User.findById(token);
//         if (user._doc) {
//             const { password, ...others } = user._id

//             const newOrder = new Order(req.body);

//             try {
//                 const savedOrder = await newOrder.save();
//                 res.status(200).json(savedOrder);
//             } catch (err) {
//                 res.status(500).json(err);
//             }

//         } else {
//             return res.status(401).json("You are not authenticated");
//         }

//     } else {
//         return res.status(401).json("Token in Header missing.");
//     }

// });

router.post("/", verifyToken, async (req, res) => {
    var orderData = req.body;
    const count = await Order.countDocuments();
    orderData["orderId"] = (count + 1).toString().padStart(6, '0');
    const newOrder = new Order(orderData);

    const products = orderData?.products;


    if (Array.isArray(products)) {
        for (let i = 0; i < products.length; i++) {
            const productId = products[i].productId;
            const quantityOrdered = parseInt(products[i].quantity);

            if (isNaN(quantityOrdered)) {
                console.warn(`Invalid quantity for product ${productId}`);
                continue;
            }

            const product = await Product.findById(productId);

            if (!product) {
                console.warn(`Product with ID ${productId} not found`);
                continue;
            }

            const newStock = product.stock - quantityOrdered;

            if (newStock < 0) {
                console.warn(`Stock too low for product ${productId}. Skipping...`);
                continue;
            }

            await Product.findByIdAndUpdate(
                productId,
                { $inc: { stock: -quantityOrdered } },
                { new: true }
            );
        }
    } else {
        console.warn("No products found or not an array");
    }



    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

//UPDATE
// router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
router.put("/:id", async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE
// router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
router.delete("/:id", async (req, res) => {

    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET USER ORDERS
// router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
router.get("/find/:userId", async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET Particular Coupon From User
router.get("/find/:userId/:couponCode", async (req, res) => {
    try {
        // Find the user's coupons based on the provided user ID
        const userOrders = await Order.find({ userId: req.params.userId });

        // Check if the requested coupon code exists among the user's coupons
        const couponExists = userOrders.some(order => order.coupons.couponCode === req.params.couponCode);

        // Return the user's coupons along with information about whether the requested coupon code has been used
        res.status(200).json({ userOrders, couponExists });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// //GET ALL
// router.get("/", verifyTokenAndAdmin, async (req, res) => {
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

// router.put("/checkout/:id", async (req, res) => {
//     try {
//         const { deliveryCharge, mop } = req.body;

//         // Optionally, encrypt the address or perform any necessary validation

//         const updatedOrder = await Order.findByIdAndUpdate(
//             req.params.id,
//             {
//                 $set: { deliveryCharge, mop },
//             },
//             { new: true }
//         );

//         res.status(200).json(updatedOrder);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// GET MONTHLY INCOME
// router.get("/income", verifyTokenAndAdmin, async (req, res) => {
router.get("/income", async (req, res) => {
    const productId = req.query.pid;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: previousMonth },
                    ...(productId && {
                        products: { $elemMatch: { productId } },
                    }),
                },
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },
        ]);
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router