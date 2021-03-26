const { Request, Response } = require("express")
const jwt = require('jwt-simple')
const mongoose = require('mongoose');
const Highscore = require("../models/highscore.model.js")

module.exports = class HighScoreController {
    /**
     * Create highscore
     * @param {Request} req 
     * @param {Response} res 
     */
    static async createHighscore(req, res) {
        try {
            //Get user
            const user = jwt.decode(req.header('Authorization')?.split('Bearer ')[1], process.env.SECRET_KEY)

            const highscore = new Highscore({
                user: user.id,
                score: req.body.score,
                generations: req.body.generations,
            })

            const result = await highscore.save()

            res.send({
                "data": {
                    "type": "highscores",
                    "id": result.id,
                    "attributes": {
                        user: highscore.user,
                        score: highscore.score,
                        generations: highscore.generations,
                    }
                }
            })
        } catch (error) {
            return res.status(400).send({
                "errors": [
                    {
                        "status": "400",
                        "source": {},
                        "title": error?.message,
                        "detail": error?.message,
                    }
                ]
            })
        }
    }
}

