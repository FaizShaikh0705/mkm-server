import express from 'express'
const router = express.Router()
import Contact from '../models/contactModel.js'


//Create
// router.post("/", verifyToken, async (req, res) => {
router.post("/", async (req, res) => {
    const newContact = new Contact(req.body);

    try {
        const savedContact = await newContact.save();
        res.status(200).json(savedContact);
    } catch (err) {
        res.status(500).json(err);
    }
});


//UPDATE
// router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
router.put("/:id", async (req, res) => {
    try {
        const updatedContact = await Contact.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedContact);
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE
//router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
router.delete("/:id", async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.status(200).json("Contact has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET Contact 
// router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
router.get("/find/:userId", async (req, res) => {
    try {
        const Contact = await Contact.findOne({ userId: req.params.userId });
        res.status(200).json(Contact);
    } catch (err) {
        res.status(500).json(err);
    }
});

// //GET ALL
// router.get("/", verifyTokenAndAdmin, async (req, res) => {
router.get("/", async (req, res) => {
    try {
        const testimonails = await Contact.find();
        res.status(200).json(testimonails);
    } catch (err) {
        res.status(500).json(err);
    }
});


export default router