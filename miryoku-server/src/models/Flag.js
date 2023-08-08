const mongoose = require('mongoose');
const { Schema } = mongoose;

const flagSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    for: {
        type: String,
        required: true
    },
    suspectID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    submitterID: {
        type: Schema.Types.ObjectId,
        required: true
    }
}, { timestamps: true })

const Flag = mongoose.model("Flag", flagSchema)

module.exports = Flag