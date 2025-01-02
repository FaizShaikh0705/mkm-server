import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    postPositionNo: {
        type: String,
    },
    sluginput:{
        type: String,
        required: true
    },
    postImage: {
        type: String,
    },
    postTopicName: {
        type: String,
    },
    postLongDetail: {
        type: String,
    },
    postIsActiveStatus: {
        type: Boolean,
    },
    postusername: {
        type: String,
    },
    Postuserprofile: {
        type: String,
    },
    postTimestamp: {
        type: Date,
        default: Date.now
    }
});

const Blog = mongoose.model('Blog', blogSchema)
export default Blog