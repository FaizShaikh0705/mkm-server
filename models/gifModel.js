import mongoose from "mongoose";

const gifSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    postPositionNo: {
        type: String,
    },
    postImage: {
        type: String,
    },
     postVideo: {
        type: String,
    },
    postusername: {
        type: String,
    },
    postTimestamp: {
        type: Date,
        default: Date.now
    }
})

const Gif = mongoose.model('Gif', gifSchema)
export default Gif