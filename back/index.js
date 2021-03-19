const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const API = require('json-api')
const UsersController = require('./controllers/users.controller')
const checkToken = require('./middleware/token.middleware')

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
        "companies": {}
    },
    {
        "dbAdapter": new API.dbAdapters.Mongoose({
            "User": require('./models/user.model'),
            "Company": require('./models/company.model')
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

// Add routes for basic list, read, create, update, delete operations
app.get("/api/:type(users|companies)", checkToken, expressStrategy.apiRequest)
app.get("/api/:type(users|companies)/:id", checkToken, expressStrategy.apiRequest)
app.post("/api/:type(users|companies)", checkToken, expressStrategy.apiRequest)
app.patch("/api/:type(users|companies)/:id", checkToken, expressStrategy.apiRequest)
app.delete("/api/:type(users|companies)/:id", checkToken, expressStrategy.apiRequest)

// Add routes for adding to, removing from, or updating resource relationships
app.post("/api/:type(users|companies)/:id/relationships/:relationship", checkToken, expressStrategy.apiRequest)
app.patch("/api/:type(users|companies)/:id/relationships/:relationship", checkToken, expressStrategy.apiRequest)
app.delete("/api/:type(users|companies)/:id/relationships/:relationship", checkToken, expressStrategy.apiRequest)

//About tokens
//TODO
app.post("/api/tokens", UsersController.generateTokens)

/** Connect to db */
mongoose.connect(process.env.DB_URI, { user: process.env.DB_USER, pass: process.env.DB_PASSWORD, useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false, bufferCommands: true })

if (process.env.NODE_ENV !== "test")
    app.listen(port, () =>
        console.log(`Example app listening at http://localhost:${port}`)
    )

module.exports = app