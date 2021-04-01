const { Request, Response } = require("express")
const Pokemon = require('../models/pokemon.model.js')

module.exports = class PokemonController {
    /**
     * Get a random pokemon
     * @param {Request} req 
     * @param {Response} res 
     */
    static async getRandomPkmn(req, res) {
        try {
            // @ts-ignore
            const pokemons = await Pokemon.find({ generation: { $in: req.query.generations ?? [1] } })

            const pokemon = pokemons[Math.floor(Math.random() * pokemons.length)]

            res.send({
                "data": {
                    "type": "pokemons",
                    "id": pokemon.id,
                    "attributes": {
                        number: pokemon.number,
                        name: pokemon.name,
                        generation: pokemon.generation,
                    }
                }
            })
        } catch (error) {
            return res.status(400).send({
                "errors": [
                    {
                        "status": "400",
                        "source": {},
                        "title": error?.message,
                        "detail": error?.message,
                    }
                ]
            })
        }
    }
}

