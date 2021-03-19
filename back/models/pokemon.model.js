const mongoose = require('mongoose')
const { Schema } = mongoose

const PokemonSchema = new Schema(
    {
        numero: {
            type: Number,
            required: true,
        },
        nom: {
            type: String,
            required: true,
        },
        generation: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

var PokemonModel = mongoose.model('Pokemon', PokemonSchema)

module.exports = PokemonModel