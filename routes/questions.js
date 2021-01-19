const express = require('express');
const { Question, validateQuestion } = require('../models/question');
const router = express.Router();
const auth = require('../middlewares/auth')

//get questions
router.get('/', async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).send({ questions });
    } catch (error) {
        res.status(503).send({ message: "Problem with db", error })
    }
})

//get questions with id
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const foundQuestion = await Question.findById(id);
        if (foundQuestion) {
            res.status(200).send({ question: foundQuestion });
        }
        else {
            res.status(404).send({ message: "Question is not found" });
        }
    } catch (error) {
        res.status(400).send({ messege: "Value is invalid", error });
    }
})

//add question
router.post('/', auth, async (req, res) => {
    const { question } = req.body;
    question.organization = req.user.organization;
    const { error } = validateQuestion(question)
    if (error) {
        return res.send({ message: error.details[0].message, error }).status(400);
    }
    const newQuestion = new Question({
        questionType: question.questionType,
        title: question.title,
        subTitle: question.subTitle,
        correctAnswers: question.correctAnswers,
        incorrectAnswers: question.incorrectAnswers,
        answersDisplay: question.answersDisplay,
        tags: question.tags,
        organization: question.organization
    })
    try {
        await newQuestion.save()
        res.send({question: newQuestion})
    } catch (error) {
        console.log(error);
        res.status(503).send({ message: "Problem occured when added to database", error });
    }
})


//update question
router.put('/:id', async (req, res) => {
    const { question } = req.body;
    const { id } = req.params
    if (question) {
        try {
            const dbQuestion = await Question.findByIdAndUpdate(id, {
                $set: {
                    title: question.title,
                    subTitle: question.subTitle,
                    correctAnswers: question.correctAnswers,
                    incorrectAnswers: question.incorrectAnswers,
                    answersDisplay: question.answersDisplay,
                    tags: question.tags
                }
            }, { new: true, useFindAndModify: false });

            if (!dbQuestion) {
                return res.status(404).send({ message: "Question not found" })
            }

            res.status(200).send({ question: dbQuestion })
        } catch (error) {
            res.status(404).send({ message: "Value is invalid", error })
        }

    }
})

//delete question
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedQuestion = await Question.findByIdAndRemove(id, { useFindAndModify: false })
        if (!deletedQuestion) {
            res.status(404).send({ message: "Question not found" });
        }

        res.status(200).send(deletedQuestion)
    } catch (error) {
        res.status(503).send({ message: "Value is Invalid", error })
    }
})

module.exports = router;