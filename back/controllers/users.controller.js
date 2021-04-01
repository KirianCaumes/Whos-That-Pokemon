const { Request, Response } = require("express")
const jwt = require('jwt-simple')
const UserModel = require("../models/user.model")
const bcrypt = require('bcrypt')

/** Time in seconds before token expire */
const EXP_SECONDS = 86400 //24h

module.exports = class UsersController {
    /**
     * Generate a new token
     * @param {Request} req 
     * @param {Response} res 
     */
    static async loginUsers(req, res) {
        try {
            const payload = await UserModel.findOne({
                username: req.body.data.attributes.username,
            })

            const validate = await bcrypt.compare(
                req.body?.data?.attributes?.password,
                payload?.password ?? ""
            )

            if (!payload || !validate)
                return res.status(404).send({
                    "errors": [
                        {
                            "status": "404",
                            "source": {},
                            "title": "User not found",
                            "detail": "User was not found."
                        }
                    ]
                })

            const token = jwt.encode({
                user: {
                    id: payload.id,
                },
                nbf: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + EXP_SECONDS
            }, process.env.SECRET_KEY)

            return res.status(200).send({
                "data": {
                    "type": "users",
                    "id": payload.id,
                    "attributes": {
                        token: token,
                    }
                }
            })
        } catch (error) {
            return res.status(401).send({
                "errors": [
                    {
                        "status": "401",
                        "source": {},
                        "title": error.message,
                        "detail": error.message,
                    }
                ]
            })
        }
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    static async registerUsers(req, res) {
        try {
            //  Now find the user by their username address
            const userDb = await UserModel.findOne({
                username: req.body?.data?.attributes?.username,
            })

            if (userDb)
                return res.status(401).send({
                    "errors": [
                        {
                            "status": "401",
                            "source": {},
                            "title": "User already exist",
                            "detail": "User already exist",
                        }
                    ]
                })

            // salt password
            const salt = await bcrypt.genSalt(10)

            const hash_password = await bcrypt.hash(
                req.body?.data?.attributes?.password,
                salt
            )
            // Insert the new user if they do not exist yet
            const user = new UserModel({
                username: req.body?.data?.attributes?.username,
                password: hash_password
            })

            await user.save()

            const token = jwt.encode({
                user: {
                    id: user.id,
                },
                nbf: Math.round(Date.now() / 1000),
                exp: Math.round(Date.now() / 1000) + EXP_SECONDS
            }, process.env.SECRET_KEY)

            res.send({
                "data": {
                    "type": "users",
                    "id": user.id,
                    "attributes": {
                        token: token,
                    }
                }
            })
        } catch (error) {
            return res.status(401).send({
                "errors": [
                    {
                        "status": "401",
                        "source": {},
                        "title": error.message,
                        "detail": error.message,
                    }
                ]
            })
        }
    }
}