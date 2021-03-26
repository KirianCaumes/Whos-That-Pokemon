const request = require('supertest')
const app = require('../index')
const HighscoreModel = require('../models/highscore.model')
const faker = require('faker')
const UserModel = require('../models/user.model')
const PokemonModel = require('../models/pokemon.model')
const { getToken } = require('./helpers/getToken')

describe('Highscore Controller', () => {
    /** @type {string} Id of the item created */
    let id
    /** @type {string} Token */
    let token

    const highscore = {
        data: {
            type: "highscores",
            attributes: {
                score: faker.random.number({ min: 0, max: 15 }),
                generations: [
                    faker.random.number({ min: 0, max: 10 }),
                    faker.random.number({ min: 0, max: 10 })
                ]
            }
        }
    }

    test('It should post', async (done) => {
        const res = await request(app)
            .post('/api/highscores')
            .send(highscore)
            .set("Content-Type", "application/vnd.api+json")
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(201)
        expect(res.body?.data?.id).toBeDefined()
        id = res.body?.data?.id
        done()
    })

    test('It should not post', async (done) => {
        const res = await request(app)
            .post('/api/highscores')
            .send({ data: {} })
            .set("Content-Type", "application/vnd.api+json")
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(400)
        done()
    })

    test('It should get data', async (done) => {
        const res = await request(app)
            .get('/api/highscores')
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(200)
        expect(res.body?.data?.length).toBeGreaterThanOrEqual(1)
        done()
    })

    test('It should get by id', async (done) => {
        const res = await request(app)
            .get(`/api/highscores/${id}`)
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(200)
        expect(res.body?.data?.id).toEqual(id)
        done()
    })

    test('It should not get by id', async (done) => {
        const res = await request(app)
            .get(`/api/highscores/123`)
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(404)
        done()
    })

    test('It should patch by id', async (done) => {
        const res = await request(app)
            .patch(`/api/highscores/${id}`)
            .send({ data: { ...highscore.data, id } })
            .set("Content-Type", "application/vnd.api+json")
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(200)
        expect(res.body?.data?.id).toEqual(id)
        done()
    })

    test('It should not patch by id', async (done) => {
        const res = await request(app)
            .patch(`/api/highscores/${id}`)
            .send({ data: {} })
            .set("Content-Type", "application/vnd.api+json")
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(400)
        done()
    })

    test('It should delete by id', async (done) => {
        const res = await request(app)
            .delete(`/api/highscores/${id}`)
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(204)
        done()
    })

    beforeAll(async () => {
        await HighscoreModel.deleteMany({})
        await UserModel.deleteMany({})
        await PokemonModel.deleteMany({})
        token = (await getToken()).token
    })
})