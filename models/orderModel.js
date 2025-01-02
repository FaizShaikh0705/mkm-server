import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
        },
        products: [
            {
                productId: {
                    type: String,
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
                postImage: {
                    type: [String],
                },
                postTopicName: {
                    type: String,
                },
                postLongDetail: {
                    type: String,
                },
                selectedVariantName: {
                    type: String,
                },
                selectedVariantPrice: {
                    type: String,
                },
                gstNumber: {
                    type: String,
                    required: true
                },
                productCode: {
                    type: String,
                    required: true
                },
                length: {
                    type: Number,
                    required: true
                },
                breadth: {
                    type: Number,
                    required: true
                },
                height: {
                    type: Number,
                    required: true
                },
                weight: {
                    type: Number,
                    required: true
                },
                itemTax: {
                    type: String,
                },
            }
        ],
        amount: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            required: false,
            default: 0
        },
        contact: {
            type: String,
            required: false,
            default: ""
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
        },
        billingAddress: {
            type: Object,
            required: true
        },
        shippingAddress: {
            type: Object,
            required: false,
            default: {},
        },
        deliveryCharge: {
            type: String,
        },
        mop: {
            type: String,
        },
        status: {
            type: String,
            default: "pending",
        },
        trackingId: {
            type: String,
            default: "pending",
        },
        couponCode: {
            type: String,
            required: false,
        },
        orderId: {
            type: String,
            required: false,
            default: ""
        },
        rzpid: {
            type: String,
            required: false,
            default: ""
        }
    },
    {
        timestamps: true
    }
)

const Order = mongoose.model('Order', orderSchema)
export default Order