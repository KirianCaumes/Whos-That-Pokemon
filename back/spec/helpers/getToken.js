const UserModel = require('../../models/user.model')
const faker = require('faker')
const jwt = require('jwt-simple')

module.exports.getToken = async function () {
    const userId = await (new UserModel({
        username: faker.name.firstName(),
        password: faker.internet.password()
    })).save()

    const token = jwt.encode({
        user: { id: userId },
        nbf: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400
    }, process.env.SECRET_KEY)

    return { userId, token }
}