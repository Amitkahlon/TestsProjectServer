const express = require('express')
const router = express.Router()
const { Exam, validateExam } = require('../models/exam');
const { answerIsCorrect } = require("../utilities/utilities");

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
    const { id } = req.params
    if (!question) return res.send({ error: 'Invalid request' }).status(403)
    const foundExam = await Exam.findOneAndUpdate({ _id: id, "questions.question.title": question.question.title }, {
        $set: {
            "questions.$.answer": question.answer
        }
    }, { useFindAndModify: false, new: true })
    if (!foundExam) return res.send({ error: 'No exam found' }).status(404)
    return res.send({ exam: foundExam })
})

router.post('/:id/done', async (req, res, next) => {
    const { exam } = req.body;
    if (!exam) return res.send({ error: 'Invalid request' }).status(403)
    const foundExam = await Exam.findById(exam._id).populate({
        path: 'testId',
        populate: {
            path: 'questions',
        }
    })
    let correctAnswers = 0
    let questionNumber = 0
    exam.questions.forEach(q => {
        foundExam.testId.questions.forEach(eq => {
            if (eq.title === q.question.title) {
                if (answerIsCorrect(eq.correctAnswers, q.answer)) {
                    correctAnswers++;
                }
                if (foundExam.testId.showCorrectAnswers) {

                    foundExam.questions[questionNumber].question.correctAnswer = eq.correctAnswers
                }
            }
        })
        questionNumber++;
    })
  
    foundExam.grade = Math.ceil(100 * (correctAnswers / foundExam.testId.questions.length))
    if (!foundExam.testId.showCorrectAnswers)
        foundExam.testId = foundExam.testId._id
    await foundExam.save()
    return res.send({ exam: foundExam })
})



router.get('/students', async (req, res) => {
    try {
        const studentsNamesAndIds = await Exam.aggregate([
            { $group: { _id: { studentId: "$studentId", studentFirstName: "$studentFirstName", studentLastName: "$studentLastName" } } }
        ]);

        return res.send({ students: studentsNamesAndIds });
    } catch (error) {
        return res.send({ message: error });
    }
})

router.get('/student', async (req, res) => {
    try {
        const { studentFirstName, studentLastName, studentId } = req.query;
        const studentsExams = await Exam.find({
            studentFirstName,
            studentLastName,
            studentId
        }).populate('testId');

        return res.send({ exams: studentsExams });
    } catch (error) {
        return res.send({ message: error })
    }
})

module.exports = router