const mongoose = require('mongoose')
const { Schema } = mongoose

const HighScoreSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        score: {
            type: String,
            required: true,
        },
        generations: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
)

var HighScoreModel = mongoose.model('HighScore', HighScoreSchema)

module.exports = HighScoreModel