var mongoose = require('mongoose')
var assert = require('assert')
var Pokemon = require('../models/pokemon.model')
var fs = require('fs')

const pokemonData = JSON.parse(fs.readFileSync('pokemons.json', 'utf-8'));

console.log(pokemonData)
