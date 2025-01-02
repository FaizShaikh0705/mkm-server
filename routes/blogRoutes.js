import express from 'express'
const router = express.Router()

import {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} from './verifyToken.js'
import Blog from '../models/blogModel.js';

//CREATE

// router.post("/", verifyTokenAndAdmin, async (req, res) => {
router.post("/", async (req, res) => {

    const newBlog = new Blog(req.body);

    try {
        const savedProduct = await newBlog.save();
        res.status(200).json(savedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

//UPDATE
// router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
router.put("/:id", async (req, res) => {

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedBlog);
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE
// router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
router.delete("/:id", async (req, res) => {

    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.status(200).json("Blog has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET PRODUCT
// router.get("/find/:id", async (req, res) => {
router.get("/find/:id", async (req, res) => {

    try {
        const product = await Blog.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET ALL PRODUCTS
// router.get("/", async (req, res) => {
router.get("/", async (req, res) => {

    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;

        if (qNew) {
            products = await Blog.find().sort({ createdAt: -1 }).limit(1);
        } else if (qCategory) {
            products = await Blog.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            products = await Blog.find();
        }

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router