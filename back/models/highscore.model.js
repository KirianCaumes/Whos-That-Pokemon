const mongoose = require('mongoose')
const { Schema } = mongoose

/**
 * HighscoreModelSchema
 * @typedef {Object} HighscoreModelSchema_
 * @property {any} user 
 * @property {number} score 
 * @property {number[]} generations
 * 
 * @typedef {HighscoreModelSchema_ & mongoose.Document} HighscoreModelSchema
 */

/** @type {mongoose.Schema<HighscoreModelSchema>} */
const HighscoreSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        score: {
            type: Number,
            required: true,
        },
        generations: {
            type: [Number],
            required: true,
        },
    },
    { timestamps: true }
)

/**
 * HighscoreModel
 * @typedef {mongoose.Model<HighscoreModelSchema, {}>} HighscoreModel
 */

/** @type {HighscoreModel} */
var HighscoreModel = mongoose.model('Highscore', HighscoreSchema)

module.exports = HighscoreModel