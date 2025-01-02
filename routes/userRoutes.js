import express from 'express'
import User from "../models/userModel.js";
import Order from "../models/orderModel.js"
import CryptoJS from 'crypto-js'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer';
import {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} from './verifyToken.js'
const router = express.Router()

//UPDATE
// router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
router.put("/:id", async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET ALL USER
// router.get("/", verifyTokenAndAdmin, async (req, res) => {
router.get("/", async (req, res) => {
    const query = req.query.new;
    try {
        const users = query
            ? await User.find().sort({ _id: -1 }).limit(5)
            : await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET USER STATS

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE user's address during checkout
// router.put("/checkout/:id", verifyTokenAndAuthorization, async (req, res) => {
router.put("/checkout/:id", async (req, res) => {
    try {
        const { billingAddress, contact, gst, shippingAddress } = req.body;

        //  const billingAddress ={
        //     shippingfirstName: "cbwic djpoejasgcuehs",
        //     shippinglastName: "cbwic djpoejasgcuehs",
        //     shippingemail: "cbwic djpoejasgcuehs",
        //     shippingcontact: "cbwic djpoejasgcuehs",
        //     shippingline1: "cbwic djpoejasgcuehs",
        //     shippingline2: "cbwic djpoejasgcuehs",
        //     shippingpostalCode: "cbwic djpoejasgcuehs",
        //     shippingcity: "cbwic djpoejasgcuehs",
        //     shippingstate: "cbwic djpoejasgcuehs",
        //  }


        const shpAdd =
            !shippingAddress || shippingAddress.length === 0
                ? [
                    {
                        shippingfirstName: billingAddress.billingfirstName,
                        shippinglastName: billingAddress.billinglastName,
                        shippingemail: billingAddress.billingemail,
                        shippingcontact: billingAddress.billingcontact,
                        shippingline1: billingAddress.billingline1,
                        shippingline2: billingAddress.billingline2,
                        shippingpostalCode: billingAddress.billingpostalCode,
                        shippingcity: billingAddress.billingcity,
                        shippingstate: billingAddress.billingstate,
                    },
                ]
                : shippingAddress;

        // Optionally, encrypt the address or perform any necessary validation
        // shippingfirstName: 'test',
        // shippingLastName: 'user',
        // shippingEmail: 'testuser@gmail.com',
        // shippingContact: '1234567890',
        // shippingLine1: 'dwygjic;l cmhfweiocahjesn',
        // shippingLine2: 'dbqu haso3p2fecec',
        // shippingPostalCode: '400003',
        // shippingCity: 'MUMBAI',
        // shippingState: 'Maharashtra'
        if (Object.keys(shippingAddress).length !== 0) {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id, {
                $set: { billingAddress, contact, gst },
                $push: { shippingAddresses: { $each: shpAdd } },
            },
                { new: true }
            );
            res.status(200).json(updatedUser);

        } else {
            // const updatedUser = await User.findByIdAndUpdate(
            //     req.params.id,
            //     {
            //         $set: { billingAddress, contact, gst },
            //     },
            //     { new: true }
            // );
            // res.status(200).json(updatedUser);

        }

    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/totalorder/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        // Count the number of orders for the user
        const totalOrders = await Order.countDocuments({ userId: userId });

        res.status(200).json({ userId: userId, totalOrderAmount: totalOrders });
    } catch (err) {
        res.status(500).json({ error: "Failed to calculate total orders" });
    }
});


// Calculate total sales
router.get("/totalsales/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        // Find all orders for the specified user
        const userOrders = await Order.find({ userId: userId });

        // Calculate total sales for the user
        let totalSales = 0;
        userOrders.forEach(order => {
            totalSales += order.amount;
        });

        res.status(200).json({ userId: userId, totalSales: totalSales });
    } catch (err) {
        res.status(500).json({ error: "Failed to calculate total sales" });
    }
});




router.put('/:userId/profile', async (req, res) => {
    const { userId } = req.params;
    const { newUsername, currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json("User not found.");
        }

        // Verify current password
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC).toString(CryptoJS.enc.Utf8);
        if (hashedPassword !== currentPassword) {
            return res.status(400).json("Current password is incorrect.");
        }

        // Update username if provided
        if (newUsername) {
            user.userName = newUsername;
        }

        // Update password if provided
        if (newPassword) {
            user.password = CryptoJS.AES.encrypt(newPassword, process.env.PASS_SEC).toString();
        }

        // Save updated user
        const updatedUser = await user.save();

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error");
    }
});



// Forgot Password Controller
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User with this email does not exist." });
        }

        // Generate a reset token (JWT)
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SEC, { expiresIn: '1h' });

        // Create a URL with the reset token
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Create a transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // e.g., 'Gmail', 'Yahoo', etc.
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS, // Your email password or app password
            },
        });

        // Set up email data
        const mailOptions = {
            from: process.env.EMAIL_USER, // sender address
            to: email, // list of receivers
            subject: "Password Reset Request", // Subject line
            text: `You requested a password reset. Please click on the following link to reset your password: ${resetUrl}`, // plain text body
            html: `<p>You requested a password reset. Please click on the following link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`, // html body
        };

        // Send the email
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Error sending email." });
            }

            // Save the reset token to the user record (optional, depending on your setup)
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            await user.save();

            res.status(200).json({ message: "Password reset email sent successfully." });
        });
    } catch (err) {
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
});

// Password Reset Controller
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SEC);
        const user = await User.findById(decoded.id);

        if (!user || user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        user.password = CryptoJS.AES.encrypt(newPassword, process.env.PASS_SEC).toString();
        user.resetPasswordToken = undefined; // clear reset token
        user.resetPasswordExpires = undefined; // clear token expiration
        await user.save();

        res.status(200).json({ message: "Password has been reset successfully." });
    } catch (err) {
        res.status(500).json({ message: "An error occurred while resetting your password." });
    }
});




export default router