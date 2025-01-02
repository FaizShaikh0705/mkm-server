import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        postPositionNo: {
            type: String,
            required: true
        },
        sluginput: {
            type: String,
            required: true
        },
        postImage: {
            type: [String],
            required: true
        },
        postTopicName: {
            type: String,
            required: true
        },
        gstNumber: {
            type: String,
            required: true
        },
        productCode: {
            type: String,
            required: true
        },
        postPriceName: {
            type: String,
            required: true
        },
        // postPriceName2: {
        //     type: String,
        //     required: true
        // },
        postVariantName1: {
            type: String,
            required: true
        },
        strikeOutName: {
            default: 0,
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        postLongDetail: {
            type: String,
            required: true
        },
        discoutpercentage: {
            type: String,
            required: true,
        },
        starCountNumber: {
            type: String,
            required: true,
        },
        postIsActiveStatus: {
            type: String,
            required: true
        },
        postusername: {
            type: String,
            required: true
        },
        length: {
            type: Number, // Assuming dimensions are numeric
            required: true
        },
        height: {
            type: Number,
            required: true
        },
        breadth: {
            type: Number,
            required: true
        },
        weight: {
            type: Number,
            required: true
        }
    }, {
    timestamps: true
});


const comboProductSchema = new mongoose.Schema(
    {
        postPositionNo: {
            type: String,
            required: true
        },
        sluginput: {
            type: String,
            required: true
        },
        comboName: {
            type: String,
            required: true
        },
        images: {
            type: [String],
            required: true
        },
        comboDescription: {
            type: String,
            required: true
        },
        comboPrice: {
            type: Number,
            required: true
        },
        products: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'  // Ensure 'Product' model is defined elsewhere
        }],
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        postIsActiveStatus: {
            type: String,
            required: true
        }
    }
);

comboProductSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Product = mongoose.model('Product', productSchema)
const ComboProduct = mongoose.model('ComboProduct', comboProductSchema);
export { Product, ComboProduct };