const request = require('supertest')
const app = require('../index')
const CompanyModel = require('../models/company.model')
const UserModel = require('../models/user.model')
const faker = require('faker')

describe('Use Controller', () => {
    /** @type {string} Token */
    let token

    const email = faker.internet.email()

    const user = {
        data: {
            type: "tokens",
            id: 1,
            attributes: {
                email: email,
                password: "aze",
            }
        }
    }

    test('It should return token', async (done) => {
        const res = await request(app)
            .post('/api/tokens')
            .send(user)
            .set("Content-Type", "application/vnd.api+json")

        expect(res.status).toEqual(201)
        expect(res.body?.data?.attributes?.authState?.expiresIn).toBeDefined()
        expect(res.body?.data?.attributes?.authState?.token).toBeDefined()
        expect(res.body?.data?.attributes?.authState?.authState).toBeDefined()
        token = res.body?.data?.attributes?.authState?.token
        done()
    })

    test('It should not return token', async (done) => {
        const res = await request(app)
            .post('/api/tokens')
            .send({
                "data": {
                    "type": "tokens",
                    "id": "1",
                    "attributes": {
                        email: "monmail@pas.valide",
                        password: "aze",
                    }
                }
            })
            .set("Content-Type", "application/vnd.api+json")

        expect(res.status).toEqual(404)
        done()
    })

    test('It should work with token', async (done) => {
        const res = await request(app)
            .get('/api/users')
            .set("Content-Type", "application/vnd.api+json")
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toEqual(200)
        done()
    })

    test('It should not work without token', async (done) => {
        const res = await request(app)
            .get('/api/users')
            .set("Content-Type", "application/vnd.api+json")
            .set("Authorization", `Bearer tokenpasvalide`)

        expect(res.status).toEqual(401)
        done()
    })

    beforeAll(async () => {
        await UserModel.deleteMany({})
        await CompanyModel.deleteMany({})
        await (new UserModel({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email,
            userType: faker.random.arrayElement(['employee', 'client']),
            employeeDashboard: faker.random.boolean(),
            clientDashboard: faker.random.boolean(),
            admin: faker.random.boolean()
        })).save()
    })
})