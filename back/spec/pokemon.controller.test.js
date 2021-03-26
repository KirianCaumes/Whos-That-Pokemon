const request = require('supertest')
const app = require('../index')
const PokemonModel = require('../models/pokemon.model')
const faker = require('faker')
const jwt = require('jwt-simple')
const { populatedb } = require('../utils/populatedb')

describe('Company Controller', () => {
    /** @type {string} Id of the item created */
    let id

    /** @type {string} Token */
    const token = jwt.encode({
        nbf: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400
    }, process.env.SECRET_KEY)

    const pokemon = {
        data: {
            type: "pokemons",
            attributes: {
                name: {
                    fr: faker.lorem.word()
                },
                number: faker.random.number({ min: 1000, max: 2000 }),
                generation: 1
            }
        }
    }

    test('It should post', async (done) => {
        const res = await request(app)
            .post('/api/pokemons')
            .send(pokemon)
            .set("Content-Type", "application/vnd.api+json")
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(201)
        expect(res.body?.data?.id).toBeDefined()
        id = res.body?.data?.id
        done()
    })

    test('It should not post', async (done) => {
        const res = await request(app)
            .post('/api/pokemons')
            .send({ data: {} })
            .set("Content-Type", "application/vnd.api+json")
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(400)
        done()
    })

    test('It should get data', async (done) => {
        const res = await request(app)
            .get('/api/pokemons')
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(200)
        expect(res.body?.data?.length).toBeGreaterThanOrEqual(1)
        done()
    })

    test('It should get random', async (done) => {
        const res = await request(app)
            .get('/api/pokemons/random?generations[]=1')
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(200)
        expect(res.body?.data?.attributes?.generation).toBe(1)
        done()
    })

    test('It should not get random', async (done) => {
        const res = await request(app)
            .get('/api/pokemons/random')
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(400)
        done()
    })

    test('It should get by id', async (done) => {
        const res = await request(app)
            .get(`/api/pokemons/${id}`)
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(200)
        expect(res.body?.data?.id).toEqual(id)
        done()
    })

    test('It should not get by id', async (done) => {
        const res = await request(app)
            .get(`/api/pokemons/123`)
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(404)
        done()
    })

    test('It should patch by id', async (done) => {
        const res = await request(app)
            .patch(`/api/pokemons/${id}`)
            .send({ data: { ...pokemon.data, id } })
            .set("Content-Type", "application/vnd.api+json")
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(200)
        expect(res.body?.data?.id).toEqual(id)
        done()
    })

    test('It should not patch by id', async (done) => {
        const res = await request(app)
            .patch(`/api/pokemons/${id}`)
            .send({ data: {} })
            .set("Content-Type", "application/vnd.api+json")
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(400)
        done()
    })

    test('It should delete by id', async (done) => {
        const res = await request(app)
            .delete(`/api/pokemons/${id}`)
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(204)
        done()
    })

    beforeAll(async () => {
        // await populatedb()
        await PokemonModel.deleteMany({})
    })
})