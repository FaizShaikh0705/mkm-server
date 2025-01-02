import express from "express";
const router = express.Router()

import Gif from '../models/gifModel.js';

router.post("/", async (req,res)=> {
    const newGif = new Gif(req.body);
    try {
        const savedGif = await newGif.save();
        res.status(200).json(savedGif)
    } catch (error) {
        res.status(500).json(err);
    }
})

// Get all GIFs
router.get("/", async (req, res) => {
    try {
        const gifs = await Gif.find();
        res.status(200).json(gifs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific GIF by ID
router.get("/:id", async (req, res) => {
    try {
        const gif = await Gif.findById(req.params.id);
        if (gif) {
            res.status(200).json(gif);
        } else {
            res.status(404).json({ message: "GIF not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a GIF by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedGif = await Gif.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (updatedGif) {
            res.status(200).json(updatedGif);
        } else {
            res.status(404).json({ message: "GIF not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a GIF by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedGif = await Gif.findByIdAndDelete(req.params.id);
        if (deletedGif) {
            res.status(200).json({ message: "GIF deleted successfully" });
        } else {
            res.status(404).json({ message: "GIF not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;