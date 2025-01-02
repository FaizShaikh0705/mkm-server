import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            unique: false,
        },
        lastName: {
            type: String,
            required: true,
            unique: false,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        billingAddress: {
            billingfirstName: { type: String, required: true },
            billinglastName: { type: String, required: true },
            billingemail: { type: String, required: true },
            billingcontact: { type: String, required: true },
            billingline1: { type: String, required: true },
            billingline2: { type: String, required: true },
            billingpostalCode: { type: String, required: true },
            billingcity: { type: String, required: true },
            billingstate: { type: String, required: true },
        },
        shippingAddresses: [
            {
                shippingfirstName: { type: String, required: true },
                shippinglastName: { type: String, required: true },
                shippingemail: { type: String, required: true },
                shippingcontact: { type: String, required: true },
                shippingline1: { type: String, required: true },
                shippingline2: { type: String, required: true },
                shippingpostalCode: { type: String, required: true },
                shippingcity: { type: String, required: true },
                shippingstate: { type: String, required: true },
            },
        ],
        contact: {
            contact: String,
        },
        gst: {
            type: String,
            default: ""
        },
        razorpayId: {
            type: String,
            default: ""
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
)

const User = mongoose.model('User', userSchema)

export default User