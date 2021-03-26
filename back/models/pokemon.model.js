const mongoose = require('mongoose')
const { Schema } = mongoose


/**
 * PokemonModelSchema
 * @typedef {Object} PokemonModelSchema_
 * @property {number} number 
 * @property {any} name 
 * @property {number} generation
 * 
 * @typedef {PokemonModelSchema_ & mongoose.Document} PokemonModelSchema
 */

/** @type {mongoose.Schema<PokemonModelSchema>} */
const PokemonSchema = new Schema(
    {
        number: {
            type: Number,
            required: true,
        },
        name: {
            fr: {
                type: String,
            },
            en: {
                type: String,
            },
            de: {
                type: String,
            },
            ja: {
                type: String,
            },
            ko: {
                type: String,
            },
        },
        generation: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
)

/**
 * PokemonModel
 * @typedef {mongoose.Model<PokemonModelSchema, {}>} PokemonModel
 */

/** @type {PokemonModel} */
var PokemonModel = mongoose.model('Pokemon', PokemonSchema)

module.exports = PokemonModel