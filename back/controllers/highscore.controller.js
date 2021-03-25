const mongoose = require('mongoose');
const HighScore = require('../models/highscore.model.js');


module.exports = class HighScoreController {

    create(req, res) {
        // Validate request
        if (!req.body.content) {
            return res.status(400).send({
                message: "HighScore content can not be empty"
            });
        }

        // Create a HighScore
        const highscore = new HighScore({
            userId: req.body.userId,
            score: req.body.score,
            generations: req.body.generations
        });

        // Save HighScore in the database
        highscore.save()
            .then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the HighScore."
                });
            });
    }

    // Retrieve and return all highScores from the database.
    findAll = (req, res) => {
        HighScore.find()
            .then(highscores => {
                res.send(highscores);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving HighScores."
                });
            });
    }

    // Find a single highScore with a highscoreId
    findOne = (req, res) => {
        HighScore.findById(req.params.highscoreId)
            .then(highscore => {
                if (!highscore) {
                    return res.status(404).send({
                        message: "HighScore not found with id " + req.params.highscoreId
                    });
                }
                res.send(highscore);
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "HighScore not found with id " + req.params.highscoreId
                    });
                }
                return res.status(500).send({
                    message: "Error retrieving HighScore with id " + req.params.highscoreId
                });
            });
    }

    // Update a highscore identified by the highscoreId in the request
    update = (req, res) => {
        // Validate Request
        if (!req.body.content) {
            return res.status(400).send({
                message: "HighScore content can not be empty"
            });
        }

        // Find highscore and update it with the request body
        HighScore.findByIdAndUpdate(req.params.highscoreId, {
            userId: req.body.userId,
            score: req.body.score,
            generations: req.body.generations
        }, { new: true })
            .then(highscore => {
                if (!highscore) {
                    return res.status(404).send({
                        message: "HighScore not found with id " + req.params.highscoreId
                    });
                }
                res.send(highscore);
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "HighScore not found with id " + req.params.highscoreId
                    });
                }
                return res.status(500).send({
                    message: "Error updating HighScore with id " + req.params.highscoreId
                });
            });
    }

    // Delete a highscore with the specified highscoreId in the request
    delete = (req, res) => {
        HighScore.findByIdAndRemove(req.params.highscoreId)
            .then(highscore => {
                if (!highscore) {
                    return res.status(404).send({
                        message: "HighScore not found with id " + req.params.highscoreId
                    });
                }
                res.send({ message: "HighScore deleted successfully!" });
            }).catch(err => {
                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return res.status(404).send({
                        message: "HighScore not found with id " + req.params.highscoreId
                    });
                }
                return res.status(500).send({
                    message: "Could not delete HighScore with id " + req.params.highscoreId
                });
            });
    }

}

