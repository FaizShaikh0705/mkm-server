import mongoose from "mongoose";

const dlvrySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    mumbaiRate: {
        type: Number,
        required: true,
    },
    allIndiaRate: {
        type: Number,
        required: true,
    },
    northeastRate: {
        type: Number,
        required: true,
    },
    postusername: {
        type: String,
    },
    postTimestamp: {
        type: Date,
        default: Date.now
    }
})

const Dlvry = mongoose.model('Dlvry',dlvrySchema)
export default Dlvry