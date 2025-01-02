import express from 'express'
const router = express.Router()

import {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} from './verifyToken.js'
import Testimonail from '../models/testimonailModel.js';


//Create
// router.post("/", verifyToken, async (req, res) => {
router.post("/", async (req, res) => {
    const newTestimonail = new Testimonail(req.body);

    try {
        const savedTestimonail = await newTestimonail.save();
        res.status(200).json(savedTestimonail);
    } catch (err) {
        res.status(500).json(err);
    }
});


//UPDATE
// router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
router.put("/:id", async (req, res) => {
    try {
        const updatedTestimonail = await Testimonail.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedTestimonail);
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE
//router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
router.delete("/:id", async (req, res) => {
    try {
        await Testimonail.findByIdAndDelete(req.params.id);
        res.status(200).json("Testimonail has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET Testimonail 
// router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
router.get("/find/:userId", async (req, res) => {
    try {
        const testimonail = await Testimonail.findOne({ userId: req.params.userId });
        res.status(200).json(testimonail);
    } catch (err) {
        res.status(500).json(err);
    }
});

// //GET ALL
// router.get("/", verifyTokenAndAdmin, async (req, res) => {
router.get("/", async (req, res) => {
    try {
        const testimonails = await Testimonail.find();
        res.status(200).json(testimonails);
    } catch (err) {
        res.status(500).json(err);
    }
});



export default router
