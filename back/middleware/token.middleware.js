const { Request, Response, NextFunction } = require("express")
const jwt = require('jwt-simple')

/**
 * Generate a new token
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
module.exports = function checkToken(req, res, next) {
    try {
        const token = req.header('Authorization')?.split('Bearer ')?.[1]

        //Validate token
        jwt.decode(token, process.env.SECRET_KEY)

        next()
    } catch (error) {
        return res.status(401).send({
            "errors": [
                {
                    "status": "401",
                    "source": {},
                    "title": error.message,
                    "detail": error.message
                }
            ]
        })
    }
}