const express = require('express');
const { Question } = require('../models/question');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Sababa')
})

router.post('/', async (req, res) => {
    const question = new Question({
        title: req.body.title
    })
    try{
        await question.save()
        res.send(question)
    }catch(err)
    {
        console.log(err);
        res.status(400).send(err)
    }
})

module.exports = router;