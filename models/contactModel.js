import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    UserName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        enum: [0, 1],
        required: true
    }
},
    {
        timestamps: true
    });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;