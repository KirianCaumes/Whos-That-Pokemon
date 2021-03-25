const { Request, Response } = require("express")
const jwt = require('jwt-simple')
const UserModel = require("../models/user.model")

/** Time in seconds before token expire */
const EXP_SECONDS = 86400 //24h

module.exports = class UsersController {
    /**
     * Generate a new token
     * @param {Request} req 
     * @param {Response} res 
     */
    static async generateTokens(req, res) {
        try {
            //TODO
            const payload = await UserModel.findOne({
                email: req.body.data.attributes.email,
                // password: req.body.data.attributes.password, //TODO add password with bcrypt
            })

            if (!payload)
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

            const exp = Math.round(Date.now() / 1000) + EXP_SECONDS

            const token = jwt.encode({
                ...payload,
                nbf: Math.round(Date.now() / 1000),
                exp: exp
            }, process.env.SECRET_KEY)

            return res.status(201).send({
                "data": {
                    "type": "tokens",
                    "id": "1",
                    "attributes": {
                        authState: {
                            expiresIn: exp, //Time ms
                            token: token, //Token
                            authState: payload //User info...
                        }
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