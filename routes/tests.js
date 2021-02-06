const express = require('express');
const { Test, validateTest } = require('../models/test')
const router = express.Router();
const auth = require('../middlewares/auth')

router.get('/', auth, async (req, res) => {
    try {
        const field = req.header('x-field')
        const foundTests = await Test.find({ field }).populate('questions field')
        if (!foundTests || foundTests.length === 0) return res.send({ message: 'No tests was found' }).status(404)
        res.status(200).send(foundTests);
    } catch (error) {
        res.send({ message: "No tests was found", error }).status(404)
    }
})

router.get('/namesAndIds', auth, async (req, res) => {
    try {
        const field = req.header('x-field')
        const foundTests = await Test.find({field}).populate('questions field')
        if(!foundTests || foundTests.length === 0) return res.send({message: 'No tests was found'}).status(404)
        res.status(200).send({tests: foundTests.map(test => {
            return {_id: test._id, title: test.title}
        })  });
    } catch (error) {
        res.send({message: "No tests was found", error}).status(404)
    }
})

router.get('/:id', async (req, res) => {
    const {id} = req.params
    try {
        const foundTest = await Test.findById(id).select('-questions').populate('questions field')
        if(!foundTest) return res.send({message: 'No test was found'}).status(404)
        const questionsTest = await Test.findById(id).populate('questions')
        let questions = []
        questionsTest.questions.forEach(q => {
            let ans = q.correctAnswers.concat(q.incorrectAnswers)
            ans.sort();
            questions.push({
                answers: ans,
                tags: q.tags,
                _id: q._id,
                questionType: q.questionType,
                title: q.title,
                answersDisplay: q.answersDisplay,
                field: q.field,
                subTitle: q.subTitle
            })
        })
        res.status(200).send({ test: { ...foundTest._doc, questions } });
    } catch (error) {
        console.log(error);
        res.send({message: "No test was found", error}).status(404)
    }
})

router.post('/', auth, async (req, res) => {
    const { test } = req.body
    if (!test) return res.send({ message: 'Invalid request.' }).status(403)
    test.field = req.header('x-field')
    test.authorEmail = req.user.email
    const { error } = validateTest(test)
    if (error) return res.send({ error: error.details }).status(400);
    const newTest = new Test({
        title: test.title,
        description: test.description,
        authorEmail: test.authorEmail,
        passGrade: test.passGrade,
        showCorrectAnswers: test.showCorrectAnswers,
        questions: test.questions,
        field: test.field,
        passMessage: test.passMessage,
        failMessage: test.failMessage
    });
    try {
        await newTest.save();
        res.status(200).send({ test: newTest });
    } catch (error) {
        res.send(error).status(400);
    }
})

router.put('/:id', auth, async (req, res) => {
    const { id } = req.params
    const { test } = req.body
    if (!test) return res.send({ message: 'Invalid request.' }).status(403)
    test.field = req.header('x-field')
    test.authorEmail = req.user.email
    const { error } = validateTest(test)
    if (error) return res.send({ error: error.details }).status(400);
    const updatedTest = await Test.findByIdAndUpdate(id, {
        $set: {
            title: test.title,
            description: test.description,
            passGrade: test.passGrade,
            showCorrectAnswers: test.showCorrectAnswers,
            questions: test.questions,
            field: test.field,
            passMessage: test.passMessage,
            failMessage: test.failMessage,
            modifiedAt: Date.now()
        }
    }, { new: true, useFindAndModify: false })
    if (!updatedTest) return res.status(404).send({ message: "Test not found." })
    res.status(200).send({ test: updatedTest });
})

router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params
    try {
        const deletedTest = await Test.findByIdAndRemove(id, { useFindAndModify: false })
        if (!deletedTest) return res.status(404).send({ message: "Test not found" });
        res.status(200).send({ test: deletedTest })
    } catch (error) {
        res.status(404).send({ message: `Test with id ${id} not removed`, error })
    }
})

module.exports = router;