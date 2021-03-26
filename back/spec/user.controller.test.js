const request = require('supertest')
const app = require('../index')
const HighscoreModel = require('../models/highscore.model')
const faker = require('faker')
const UserModel = require('../models/user.model')
const PokemonModel = require('../models/pokemon.model')
const { getToken } = require('./helpers/getToken')

describe('User Controller', () => {
    /** @type {string} Id of the item created */
    let id
    /** @type {string} Token */
    let token

    const user = {
        data: {
            type: "users",
            attributes: {
                username: faker.name.firstName(),
                password: faker.internet.password(),
            }
        }
    }

    test('It should post', async (done) => {
        const res = await request(app)
            .post('/api/users')
            .send(user)
            .set("Content-Type", "application/vnd.api+json")
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(201)
        expect(res.body?.data?.id).toBeDefined()
        id = res.body?.data?.id
        done()
    })

    test('It should not post', async (done) => {
        const res = await request(app)
            .post('/api/users')
            .send({ data: {} })
            .set("Content-Type", "application/vnd.api+json")
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(400)
        done()
    })

    test('It should get data', async (done) => {
        const res = await request(app)
            .get('/api/users')
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(200)
        expect(res.body?.data?.length).toBeGreaterThanOrEqual(1)
        done()
    })

    test('It should get by id', async (done) => {
        const res = await request(app)
            .get(`/api/users/${id}`)
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(200)
        expect(res.body?.data?.id).toEqual(id)
        done()
    })

    test('It should not get by id', async (done) => {
        const res = await request(app)
            .get(`/api/users/123`)
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(404)
        done()
    })

    test('It should patch by id', async (done) => {
        const res = await request(app)
            .patch(`/api/users/${id}`)
            .send({ data: { ...user.data, id } })
            .set("Content-Type", "application/vnd.api+json")
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(200)
        expect(res.body?.data?.id).toEqual(id)
        done()
    })

    test('It should not patch by id', async (done) => {
        const res = await request(app)
            .patch(`/api/users/${id}`)
            .send({ data: {} })
            .set("Content-Type", "application/vnd.api+json")
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(400)
        done()
    })

    test('It should delete by id', async (done) => {
        const res = await request(app)
            .delete(`/api/users/${id}`)
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(204)
        done()
    })

    test('It should register', async (done) => {
        const res = await request(app)
            .post('/api/users/register')
            .send(user)
            .set("Content-Type", "application/vnd.api+json")

        expect(res.status).toEqual(200)
        expect(res.body?.data?.attributes?.token).toBeDefined()
        done()
    })

    test('It should not register ', async (done) => {
        const res = await request(app)
            .post('/api/users/register')
            .send()
            .set("Content-Type", "application/vnd.api+json")

        expect(res.status).toEqual(401)
        done()
    })

    test('It should login', async (done) => {
        const res = await request(app)
            .post('/api/users/login')
            .send(user)
            .set("Content-Type", "application/vnd.api+json")

        expect(res.status).toEqual(200)
        expect(res.body?.data?.attributes?.token).toBeDefined()
        done()
    })

    test('It should not login with wrong email', async (done) => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                data: {
                    ...user.data,
                    attributes: {
                        ...user.data.attributes,
                        username: "wrong@mail.com"
                    }
                }
            })
            .set("Content-Type", "application/vnd.api+json")

        expect(res.status).toEqual(404)
        done()
    })

    test('It should not login with wrong password', async (done) => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                data: {
                    ...user.data,
                    attributes: {
                        ...user.data.attributes,
                        password: "wrong password",
                    }
                }
            })
            .set("Content-Type", "application/vnd.api+json")

        expect(res.status).toEqual(404)
        done()
    })

    beforeAll(async () => {
        await HighscoreModel.deleteMany({})
        await UserModel.deleteMany({})
        await PokemonModel.deleteMany({})
        token = (await getToken()).token
    })
})