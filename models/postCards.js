import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    frontMessage: String,
    backMessage: String,
    tags: [String],
    creator: String,
    favorite: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
});

const postCard = mongoose.model('postCard', postSchema);

export default postCard;