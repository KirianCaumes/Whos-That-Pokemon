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
        const token = req.header('Authorization').split('Bearer ')[1]

        const data = jwt.decode(token, process.env.SECRET_KEY) //This function throw SOMETIMES errors that it should not

        if (!data || !data.exp)
            throw new Error('Invalid token')

        if (data.exp < Date.now() / 1000)
            throw new Error('Token expired')

        next()
    } catch (error) {
        /**
         * MAY NEED TO BE UNCOMMENTED
         * We are force to do this stuff, because lib JWT throw (sometimes) errors on token 
         * (sometimes its null, sometimes expired) but for no logic reason
         */
        // if (
        //     process.env.NODE_ENV === "test" &&
        //     req.header('Authorization') !== "Bearer tokenpasvalide" //That's ugly
        // )
        //     return next()
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