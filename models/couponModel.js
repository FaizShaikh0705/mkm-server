import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        couponCode: {
            type: String,
            required: true,
        },
        usageLimitPerCustomer: {
            type: String,
            enum: ['Allow Once', 'Allow Twice'],
            required: true,
        },
        discountPercentage: {
            type: Number,
            required: true,
            min: 0,
        },
        flatAmount: {
            type: Number,
            required: false,
            min: 0,
        },
        minimumOrderCondition: {
            type: String,
            enum: ['Order Value', 'Order Quantity'],
            required: false,
        },
        SelectedProduct: {
            type: String,
            enum: ['All Products', 'Hair Oil'],
            required: true,
        },
        minimumOrderValue: {
            type: Number,
            required: true,
            min: 0,
        },
        maximumDiscount: {
            type: Number,
            required: true,
            min: 0,
        },
        position: {
            type: String,
            required: true,
        },
        status: {
            type: Number,
            enum: [0, 1],
            required: true,
        },

    },
    {
        timestamps: true
    });

const Coupon = mongoose.model('Coupon', couponSchema)
export default Coupon