const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')
const { Schema } = mongoose;

const artworkSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    tags: {
        type: [String],
        required: true
    },
    ownerID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    longDescription: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    titleStyle: {
        fontFamily: {
            type: String
        },
        fontStyle: {
            type: String
        }
    },
    bodyStyle: {
        fontFamily: {
            type: String
        },
        fontSize: {
            type: String
        }
    },
    rating: {
        score: {
            type: Number,
            required: true
        },
        count: {
            type: Number,
            required: true
        }
    }
}, { timestamps: true });

artworkSchema.plugin(mongoosePaginate)

const Artwork = mongoose.model('Artwork', artworkSchema);

module.exports = Artwork;