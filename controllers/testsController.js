const express = require('express');
const { Test, validateTest } = require('../models/test')
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const tests = await Test.find().populate('questions organization').sort({title: 1});
        if(!tests || tests.length === 0) return res.status(404).send({message: 'No tests found'})
        res.status(200).send(tests);
    } catch (error) {
        res.status(404).send({message: "No tests was found", error})
    }
})

router.get('/:id', async (req, res) => {
    const {id} = req.params
    try {
        const test = await Test.findById(id).populate('questions organization')
        res.status(200).send(test);
    } catch (error) {
        res.status(404).send({message: "No test was found", error})
    }
})

router.post('/', async (req, res) => {
    const {test} = req.body
    const {error} = validateTest(test)
    if(error) return res.status(400).send(error.details[0].message);
    const newTest = new Test({
        title: test.title,
        description: test.description,
        authorEmail: test.authorEmail,
        passGrade: test.passGrade,
        showCorrectAnswers: test.showCorrectAnswers,
        questions: test.questions,
        organization: test.organization
    });
    try {
        await newTest.save();
        res.status(200).send({test: newTest});
    } catch (error) {
        res.status(400).send(error);
    }
})

router.put('/:id', async (req, res) => {
    const {id} = req.params
    const {test} = req.body
    const {error} = validateTest(test)
    if(error) return res.status(400).send(error.details[0].message);
    const updatedTest = await Test.findByIdAndUpdate(id, {
        $set:{
            title: test.title,
            description: test.description,
            authorEmail: test.authorEmail,
            passGrade: test.passGrade,
            showCorrectAnswers: test.showCorrectAnswers,
            questions: test.questions,
            organization: test.organization
        }
    }, {new:true, useFindAndModify: false})
    if(!updatedTest) return res.status(404).send({message: "Test not found."})
    res.status(200).send({test: updatedTest});
})

router.delete('/:id', async (req, res) => {
    const {id} = req.params
    try {
        const deletedTest = await Test.findByIdAndRemove(id, { useFindAndModify: false })
        if(!deletedTest) return res.status(404).send({ message: "Test not found" });
        res.status(200).send(deletedTest)
    } catch (error) {
        res.status(404).send({ message: `Test with id ${id} not removed`, error })
    }
})

module.exports = router;