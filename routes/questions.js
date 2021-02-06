const express = require('express');
const { Question, validateQuestion } = require('../models/question');
const router = express.Router();
const auth = require('../middlewares/auth')

const { getQuestions, getQuestionById, addQuestion, deleteQuestion, editQuestion } = require('../bl/questionService');


//get questions
router.get('/', auth, async (req, res) => {
    try {
        const field = req.header('x-field');
        if (!field) {
            return res.send({ message: "field cannot be empty" })
        }
        const questions = await getQuestions(field);

        if (!questions || questions.length === 0) return res.send({ message: 'No questions was found' }).status(404)
        return res.status(200).send({ questions });
    } catch (error) {
        return res.send({ message: "No questions was found", error }).status(404)
    }
})

//get questions with id
router.get('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.send({ message: "id cannot be null" });
        }
        const foundQuestion = await getQuestionById(id);
        if (foundQuestion) {
            return res.status(200).send({ question: foundQuestion });
        }
        else {
            return res.status(404).send({ message: "Question is not found" });
        }
    } catch (error) {
        return res.status(400).send({ messege: "Value is invalid", error });
    }
})

//add question
router.post('/', auth, async (req, res) => {
    const { question } = req.body;
    const field = req.header('x-field');

    if (!question || !field) {
        return res.send({ message: 'Invalid request, data is missing' }).status(403);
    }

    question.field = field;

    const { error } = validateQuestion(question)
    if (error) {
        return res.send({ message: error.details, error }).status(400);
    }

    const newQuestion = new Question({
        questionType: question.questionType,
        title: question.title,
        subTitle: question.subTitle,
        correctAnswers: question.correctAnswers,
        incorrectAnswers: question.incorrectAnswers,
        answersDisplay: question.answersDisplay,
        tags: question.tags,
        field: question.field,
        LastEdited: Date.now()
    })

    console.log(newQuestion);

    try {
        const question = await addQuestion(newQuestion);
        return res.send({ question });
    } catch (err) {
        console.log(error);
        res.send({ message: "Problem occured when added to database", error });
    }
})


//update question
router.put('/:id', auth, async (req, res) => {
    const { question } = req.body;
    const field = req.header('x-field');
    const { id } = req.params

    if (!question || !field || !id) {
        return res.send({ message: 'Invalid request. missing data' }).status(403);
    }

    question.field = field;
    question.LastEdited = Date.now();
    //todo: to enable edit validation we need to figure the organiztion stuff..
    // const { error } = validateQuestion(question)
    // if (error) {
    //     return res.send({ message: error.details[0].message, error }).status(400);
    // }

    try {
        const dbQuestion = await editQuestion(id, question)
        if (!dbQuestion) {
            return res.status(404).send({ message: "Question not found" })
        }

        res.status(200).send({ question: dbQuestion })
    } catch (error) {
        res.status(404).send({ message: "Value is invalid", error })
    }
})

//delete question
router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.send({ message: "id cannot be empty" })
    }

    try {
        const deletedQuestion = await deleteQuestion(id);
        if (!deletedQuestion) {
            res.status(404).send({ message: "Question not found" });
        }

        res.status(200).send({ question: deletedQuestion })
    } catch (error) {
        res.status(503).send({ message: "Value is Invalid", error })
    }
})

module.exports = router;