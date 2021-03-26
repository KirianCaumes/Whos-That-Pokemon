const mongoose = require('mongoose')
const fs = require('fs')
const Pokemon = require('../models/pokemon.model.js')
require('dotenv')
    .config({ path: process.env.NODE_ENV === "test" ? ".env.test" : undefined })

module.exports.populatedb = async function () {
    /** Connect to db */
    mongoose.connect(process.env.DB_URI, { user: process.env.DB_USER, pass: process.env.DB_PASSWORD, useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false, bufferCommands: true })

    /** Data from JSON */
    const data = JSON.parse(fs.readFileSync("./pokemons.json", 'utf8'))

    /** Pokemons */
    const pokemons = data.map(x => new Pokemon({
        number: x.number,
        name: x.name,
        generation: x.generation,
    }))

    // Clean
    await Pokemon.deleteMany({})

    // Insert
    await Pokemon.insertMany(pokemons)

    console.log("ok")

    return true
}