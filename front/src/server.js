// @ts-ignore
import { createServer, Model, JSONAPISerializer, belongsTo, Factory, trait, hasMany } from "miragejs"

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
                            user: user, score: 5, generations: [1, 2]
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
            server.create("highscore", "withUser", { score: 5, generations: [1, 2] })
            // @ts-ignore
            server.create("pokemon", { number: 25, generations: 1, name: { fr: "Pikachu", en: "Pikachu" } })
        },
        routes() {
            this.namespace = "api"

            this.get("/users")
            this.get("/users/:id")
            this.post("/users")
            this.delete("/users/:id")
            //TODO
            this.post("/users/login", schema => {
                // @ts-ignore
                return schema.users.all()
            })
            //TODO
            this.post("/users/register", schema => {
                // @ts-ignore
                return schema.users.all()
            })

            this.get("/highscores")
            this.get("/highscores/:id")
            this.post("/highscores")
            this.delete("/highscores/:id")

            this.get("/pokemons")
            //TODO
            this.get("/pokemons/random", schema => {
                // @ts-ignore
                return schema.users.all()
            })
            this.get("/pokemons/:id")
            this.post("/pokemons")
            this.delete("/pokemons/:id")
        }
    })

    return server
}