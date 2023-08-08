const mongoose = require('mongoose');
const { Schema } = mongoose;

const replySchema = new Schema({
    parentID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    ownerID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    for: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true })

const Reply = mongoose.model('Reply', replySchema)

module.exports = Reply