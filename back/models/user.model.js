const mongoose = require('mongoose')
const { Schema } = mongoose

/**
 * UserModelSchema
 * @typedef {Object} UserModelSchema_
 * @property {string} username 
 * @property {string} password 
 * 
 * @typedef {UserModelSchema_ & mongoose.Document} UserModelSchema
 */

/** @type {mongoose.Schema<UserModelSchema>} */
const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

/**
 * UserModel
 * @typedef {mongoose.Model<UserModelSchema, {}>} UserModel
 */

/** @type {UserModel} */
var UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel