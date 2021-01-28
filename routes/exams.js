const express = require('express')
const router = express.Router()
const { Exam, validateExam } = require('../models/exam')

router.post('/', async (req, res) => {
    const { exam } = req.body
    if (!exam) return res.send({ error: 'Invalid request.' }).status(403)
    const { error } = validateExam(exam)
    if (error) return res.send({ error: error.details }).status(400);
    const newExam = new Exam({
        studentId: exam.studentId,
        studentEmail: exam.studentEmail,
        studentFirstName: exam.studentFirstName,
        studentLastName: exam.studentLastName,
        class: exam.class,
        testId: exam.testId,
        questions: exam.questions
    })
    try {
        await newExam.save();
        res.status(200).send({ exam: newExam });
    } catch (error) {
        res.send(error).status(400);
    }
})

router.post('/:id', async (req, res) => {
    const { question } = req.body
    console.log(question);
    const { id } = req.params
    if (!question) return res.send({ error: 'Invalid request' }).status(403)
    const foundExam = await Exam.updateOne({ _id: id, "questions.question.title": question.question.title }, {
        $set: {
            "questions.$.answer": question.answer
        }
    })
    if (!foundExam) return res.send({ error: 'No exam found' }).status(404)
    return res.send(true)
})

module.exports = router