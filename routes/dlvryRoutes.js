// routes/deliveryCharges.js
import express from 'express'
const router = express.Router();
import Dlvry from '../models/dlvryModel.js'

// Create new delivery charges
router.post('/', async (req, res) => {
    try {
        const { userId,mumbaiRate, allIndiaRate, northeastRate } = req.body;

        const newCharges = new Dlvry({
            userId,
            mumbaiRate,
            allIndiaRate,
            northeastRate,
        });

        const savedCharges = await newCharges.save();
        res.status(201).json(savedCharges);
    } catch (error) {
        res.status(500).json({ message: 'Error creating delivery charges', error });
    }
});

// Get all delivery charges
router.get('/', async (req, res) => {
    try {
        const charges = await Dlvry.find();
        res.status(200).json(charges);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching delivery charges', error });
    }
});

// Get delivery charges by ID
router.get('/:id', async (req, res) => {
    try {
        const charges = await Dlvry.findById(req.params.id);
        if (!charges) {
            return res.status(404).json({ message: 'Delivery charges not found' });
        }
        res.status(200).json(charges);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching delivery charges', error });
    }
});

// Update delivery charges by ID
router.put('/:id', async (req, res) => {
    try {
        const { mumbaiRate, allIndiaRate, northeastRate } = req.body;

        const updatedCharges = await Dlvry.findByIdAndUpdate(
            req.params.id,
            { mumbaiRate, allIndiaRate, northeastRate },
            { new: true } // return updated document
        );

        if (!updatedCharges) {
            return res.status(404).json({ message: 'Delivery charges not found' });
        }

        res.status(200).json(updatedCharges);
    } catch (error) {
        res.status(500).json({ message: 'Error updating delivery charges', error });
    }
});

// Delete delivery charges by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedCharges = await Dlvry.findByIdAndDelete(req.params.id);
        if (!deletedCharges) {
            return res.status(404).json({ message: 'Delivery charges not found' });
        }
        res.status(200).json({ message: 'Delivery charges deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting delivery charges', error });
    }
});

export default router;
