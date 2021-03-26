const mongoose = require('mongoose')
const { Schema } = mongoose

const HighscoreSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        score: {
            type: String,
            required: true,
        },
        generations: {
            type: [Number],
            required: true,
        },
    },
    { timestamps: true }
)

var HighscoreModel = mongoose.model('Highscore', HighscoreSchema)

module.exports = HighscoreModel