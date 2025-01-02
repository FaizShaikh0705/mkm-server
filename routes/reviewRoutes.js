import express from 'express'
const router = express.Router()

import {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} from './verifyToken.js'
import Review from '../models/reviewModel.js';


//Create
// router.post("/", verifyToken, async (req, res) => {
router.post("/", async (req, res) => {
    const newReview = new Review(req.body);

    try {
        const savedReview = await newReview.save();
        res.status(200).json(savedReview);
    } catch (err) {
        res.status(500).json(err);
    }
});


//UPDATE
// router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
router.put("/:id", async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedReview);
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE
//router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
router.delete("/:id", async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.status(200).json("Review has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET Testimonail 
// router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
router.get("/find/:userId", async (req, res) => {
    try {
        const review = await Review.findOne({ userId: req.params.userId });
        res.status(200).json(review);
    } catch (err) {
        res.status(500).json(err);
    }
});

// //GET ALL
// router.get("/", verifyTokenAndAdmin, async (req, res) => {
router.get("/", async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json(err);
    }
});



export default router
