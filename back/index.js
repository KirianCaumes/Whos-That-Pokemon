const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const API = require('json-api')
const UsersController = require('./controllers/users.controller')
const checkToken = require('./middleware/token.middleware')
const PokemonController = require('./controllers/pokemon.controller')
const HighScoreController = require('./controllers/highscore.controller')

/** Import env variables */
require('dotenv').config({ path: process.env.NODE_ENV === "test" ? ".env.test" : undefined })

const app = express()
const port = 5000

/** Setup app */
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ type: 'application/vnd.api+json' }))

const registry = new API.ResourceTypeRegistry(
    {
        "users": {},
        "highscores": {},
        "pokemons": {}
    },
    {
        "dbAdapter": new API.dbAdapters.Mongoose({
            "User": require('./models/user.model'),
            "Highscore": require('./models/highscore.model'),
            "Pokemon": require('./models/pokemon.model'),
        }),
        "urlTemplates": {
            "self": "/api/{type}/{id}"
        }
    }
)

// Set up a front controller, passing it controllers that'll be used to handle requests for API resources and for the auto-generated docs.
const expressStrategy = new API.httpStrategies.Express(
    new API.controllers.API(registry),
    new API.controllers.Documentation(registry, { name: 'Example API' })
)

// Render the docs at /
app.get("/", expressStrategy.docsRequest)

//Users 
app.post("/api/users/login", UsersController.loginUsers)
app.post("/api/users/register", UsersController.registerUsers)


//Pokemons
app.get("/api/pokemons/random", checkToken, PokemonController.getRandomPkmn)

//Highscores
app.post("/api/highscores", checkToken, HighScoreController.createHighscore)

// Add routes for basic list, read, create, update, delete operations
app.get("/api/:type(users|pokemons|highscores)", expressStrategy.apiRequest)
app.get("/api/:type(users|pokemons|highscores)/:id", expressStrategy.apiRequest)
app.post("/api/:type(users|pokemons|highscores)", expressStrategy.apiRequest)
app.patch("/api/:type(users|pokemons|highscores)/:id", expressStrategy.apiRequest)
app.delete("/api/:type(users|pokemons|highscores)/:id", expressStrategy.apiRequest)

// Add routes for adding to, removing from, or updating resource relationships
app.post("/api/:type(users|pokemons|highscores)/:id/relationships/:relationship", checkToken, expressStrategy.apiRequest)
app.patch("/api/:type(users|pokemons|highscores)/:id/relationships/:relationship", checkToken, expressStrategy.apiRequest)
app.delete("/api/:type(users|pokemons|highscores)/:id/relationships/:relationship", checkToken, expressStrategy.apiRequest)

/** Connect to db */
mongoose.connect(process.env.DB_URI, { user: process.env.DB_USER, pass: process.env.DB_PASSWORD, useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false, bufferCommands: true })

if (process.env.NODE_ENV !== "test")
    app.listen(port, () =>
        console.log(`Example app listening at http://localhost:${port}`)
    )

module.exports = app