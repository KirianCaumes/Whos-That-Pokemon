const { Request, Response } = require("express")
const jwt = require('jwt-simple')
const Joi = require('joi')
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

            //TODO
            const payload = await UserModel.findOne({
                username: req.body.data.attributes.username,
            })

            // @ts-ignore
            const validate = await bcrypt.compare(req.body.data.attributes.password, payload.password);
            if (validate) {
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
                        "type": "users",
                        "id": payload.id,
                        "attributes": {
                            token: token,
                        }
                    }
                })
            } else {
                return res.status(201).send({
                    "errors": [
                        {
                            "status": "401",
                            "source": {},
                            "title": "Password not correct",
                            "detail": "Password not correct",
                        }
                    ]
                })
            }
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
        //  Now find the user by their username address
        let user = await UserModel.findOne({
            username: req.body.username,
        });
        if (user) {
            return res.status(400).send({
                "errors": [
                    {
                        "status": "401",
                        "source": {},
                        "title": "Not found",
                        "detail": "Not found",
                    }
                ]
            });
        } else {
            // salt password
            const salt = await bcrypt.genSalt(10);
            let hash_password = await bcrypt.hash(req.body.password, salt);
            // Insert the new user if they do not exist yet
            user = new UserModel({
                username: req.body.username,
                password: hash_password
            });
            await user.save();

            const exp = Math.round(Date.now() / 1000) + EXP_SECONDS

            const token = jwt.encode({
                ...user,
                nbf: Math.round(Date.now() / 1000),
                exp: exp
            }, process.env.SECRET_KEY)

            res.send({
                "data": {
                    "type": "users",
                    "id": user.id,
                    "attributes": {
                        token: token,
                    }
                }
            }
            );
        }
    }
}