import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        UserName: {
            type: String,
            required: true
        },
        postImage: {
            type: String,
            required: true
        },
        postImage1: {
            type: String,
            required: true
        },
        productRating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        postLongDetail: {
            type: String,
            required: true
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
    }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
