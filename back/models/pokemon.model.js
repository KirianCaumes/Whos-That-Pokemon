const mongoose = require('mongoose')
const { Schema } = mongoose

const PokemonSchema = new Schema(
    {
        numero: {
            type: Number,
            required: true,
        },
        name: [{
            fr: {
                type: String,
            },
            en: {
                type: String,
            },
        }],
        generation: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

var PokemonModel = mongoose.model('Pokemon', PokemonSchema)

module.exports = PokemonModel