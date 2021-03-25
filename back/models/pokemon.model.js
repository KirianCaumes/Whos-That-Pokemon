const mongoose = require('mongoose')
const { Schema } = mongoose

const PokemonSchema = new Schema(
    {
        numero: {
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

var PokemonModel = mongoose.model('Pokemon', PokemonSchema)

module.exports = PokemonModel