const mongoose = require('mongoose');
const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2')

const feedbackSchema = new Schema({
    artworkID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    ownerID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    usefulness: {
        rating: {
            type: Number,
            required: true,
            default: 0
        },
        count: {
            type: Number,
            required: true,
            default: 0
        }
    },
    body: {
        type: String,
        required: true
    }
}, { timestamps: true })

feedbackSchema.plugin(mongoosePaginate)

const Feedback = mongoose.model('Feedback', feedbackSchema)

module.exports = Feedback