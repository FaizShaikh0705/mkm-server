import express from 'express'
import userModel from '../models/userModel.js'
import CryptoJS from 'crypto-js'
import jwt from 'jsonwebtoken'
const router = express.Router()

//Register
router.post('/register', async (req, res) => {

    const user = await userModel.findOne({ email: req.body.email })
    // !user && 
    if (user) {
        return res.status(401).json("User already exists.");
    }

    const newUser = new userModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        billingAddress: {
            billingfirstName: "not provided",
            billinglastName: "not provided",
            billingemail: "not provided",
            billingcontact: "not provided",
            billingline1: "not provided",
            billingline2: "not provided",
            billingpostalCode: "not provided",
            billingcity: "not provided",
            billingstate: "not provided",
        },
        shippingAddresses: [
            {
                shippingfirstName: "not provided",
                shippinglastName: "not provided",
                shippingemail: "not provided",
                shippingcontact: "not provided",
                shippingline1: "not provided",
                shippingline2: "not provided",
                shippingpostalCode: "not provided",
                shippingcity: "not provided",
                shippingstate: "not provided",
            },
        ],
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });

    try {
        const savedUser = await newUser.save();

        const accessToken = jwt.sign({
            id: savedUser._id,
            isAdmin: savedUser.isAdmin,
        }, process.env.JWT_SEC,
            { expiresIn: "30d" })

        const { password, ...others } = savedUser._doc;

        res.status(201).json({ ...others, accessToken });
    } catch (err) {
        res.status(500).json(err);
    }
})

//Login
router.post('/login', async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        // !user && 
        if (!user) {
            return res.status(401).json("Username does not exists.");
        }

        const hashedpassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC)
        const originalPassword = hashedpassword.toString(CryptoJS.enc.Utf8)

        if (originalPassword !== req.body.password) {
            return res.status(401).json("Password does not match.")
        }

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        }, process.env.JWT_SEC,
            { expiresIn: "30d" })

        const { password, ...others } = user._doc;

        res.status(200).json({ ...others, accessToken });
    } catch (err) {
        res.status(500).json(err)
    }
})


// Profile Edit Endpoint
router.put('/profile', async (req, res) => {
    const { userId } = req.body;
    const { newUsername, newPassword } = req.body;

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json("User not found.");
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
        res.status(500).json(error);
    }
});

export default router