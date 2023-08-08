const mongoose = require('mongoose');
const { Schema } = mongoose;

const opinionSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    submitterID: {
        type: Schema.Types.ObjectId,
        required: true
    }
}, { timestamps: true })

const Opinion = mongoose.model("Opinion", opinionSchema)

module.exports = Opinion