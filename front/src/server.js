// @ts-ignore
import { createServer, Model, JSONAPISerializer, belongsTo, Factory, trait, hasMany } from "miragejs"
import faker from "faker"

export function makeServer({ environment = "test" } = {}) {
    const server = createServer({
        environment,
        serializers: {
            application: JSONAPISerializer
        },
        models: {
            user: Model.extend({
                highscores: hasMany(),
            }),
            highscore: Model.extend({
                user: belongsTo(),
            }),
            pokemon: Model,
        },
        factories: {
            user: Factory.extend({
                withHighScores: trait({
                    afterCreate(user, server) {
                        server.createList('highscore', 10, {
                            user: user,
                            score: faker.random.number({ min: 0, max: 10 }),
                            generations: [1, 2],
                            createdAt: new Date()
                        })
                    }
                })
            }),
            highscore: Factory.extend({
                withUser: trait({
                    afterCreate(highscore, server) {
                        server.create('user', {
                            name: "UserThree",
                            password: "PasswordThree",
                            highscores: [highscore]
                        })
                    }
                })
            }),
        },
        seeds(server) {
            // @ts-ignore
            server.create("user", "withHighScores", { name: "UserOne", password: "PasswordOne" })
            // @ts-ignore
            server.create("user", "withHighScores", { name: "UserTwo", password: "PasswordTwo" })
            // @ts-ignore
            server.create("highscore", "withUser", { score: 5, generations: [1, 2], createdAt: new Date() })
            // @ts-ignore
            server.create("pokemon", { number: 25, generation: 1, name: { fr: "Pikachu", en: "Pikachuen" } })
            // @ts-ignore
            server.create("pokemon", { number: 26, generation: 1, name: { fr: "Pikachu2", en: "Pikachuen2" } })
        },
        routes() {
            this.namespace = "api"

            this.get("/users")
            this.get("/users/:id")
            this.post("/users")
            this.delete("/users/:id")
            this.post("/users/login", schema => {
                // @ts-ignore
                return {
                    "data": {
                        "type": "users",
                        "id": "1",
                        "attributes": {
                            token: "mytoken"
                        }
                    }
                }
            })
            this.post("/users/register", schema => {
                // @ts-ignore
                return {
                    "data": {
                        "type": "users",
                        "id": "1",
                        "attributes": {
                            token: "mytoken"
                        }
                    }
                }
            })
            // this.passthrough("/users")
            // this.passthrough("/users/:id")
            // this.passthrough("/users/login")
            // this.passthrough("/users/register")

            this.get("/highscores")
            this.get("/highscores/:id")
            this.post("/highscores")
            this.delete("/highscores/:id")

            // this.passthrough("/highscores")
            // this.passthrough("/highscores/:id")

            this.get("/pokemons")
            this.get("/pokemons/random", (schema, request) => {
                // console.log(request.queryParams)
                // @ts-ignore
                return schema.pokemons.findBy({})
            })
            this.get("/pokemons/:id")
            this.post("/pokemons")
            this.delete("/pokemons/:id")

            // this.passthrough("/pokemons")
            // this.passthrough("/pokemons/:id")
            // this.passthrough("/pokemons/random")
        }
    })

    return server
}