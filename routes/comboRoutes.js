import express from 'express';
const router = express.Router();
import { ComboProduct } from '../models/productModel.js'; // Update the import path accordingly

// CREATE Combo Product
router.post("/", async (req, res) => {
    const { comboName, images, comboDescription, comboPrice, postPositionNo, sluginput, products } = req.body;
    const newCombo = new ComboProduct({ comboName, images, comboDescription, comboPrice, postPositionNo, sluginput, products });

    try {
        const savedCombo = await newCombo.save();
        res.status(200).json(savedCombo);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE Combo Product
router.put("/:id", async (req, res) => {
    try {
        const updatedCombo = await ComboProduct.findByIdAndUpdate(
            req.params.id,
            { $set: req.body, updatedAt: Date.now() },
            { new: true }
        );
        res.status(200).json(updatedCombo);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE Combo Product
router.delete("/:id", async (req, res) => {
    try {
        await ComboProduct.findByIdAndDelete(req.params.id);
        res.status(200).json("Combo product has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET Combo Product by ID
router.get("/find/:id", async (req, res) => {
    try {
        const combo = await ComboProduct.findById(req.params.id).populate('products');
        res.status(200).json(combo);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL Combo Products
router.get("/", async (req, res) => {
    try {
        const combos = await ComboProduct.find().populate('products');
        res.status(200).json(combos);
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;
