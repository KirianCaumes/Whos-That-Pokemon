const Pokemon = require('../models/pokemon.model.js');


module.exports = class PokemonController {

    create(req, res) {
        // Validate request
        if (!req.body.content) {
            return res.status(400).send({
                message: "Pokemon content can not be empty"
            });
        }

        // Create a Pokemon
        const pokemon = new Pokemon({
            numero: req.body.numero,
            name: req.body.name,
            generation: req.body.generation,
        });

        // Save Pokemon in the database
        pokemon.save()
            .then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the HighScore."
                });
            });
    }

}

