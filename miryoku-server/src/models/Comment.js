const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    artworkID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    commenterID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    likes: {
        type: Number,
        required: true,
        default: 0
    },
    body: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;