const express = require('express');
const { Question } = require('../models/question');
const router = express.Router();

//get questions
router.get('/', async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).send(questions);
    } catch (error) {
        res.status(404).send({message: "Problem with db", error})
    }
})

//get questions with id
router.get('/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const foundQuestion = await Question.findById(id);
            if(foundQuestion){
                res.status(200).send(foundQuestion);
            }
            else {
                res.status(404).send("Question is not found");
            }
        } catch (error) {
            res.status(404).send({ messege: "Value is invalid", error });
        }
})

//add question
router.post('/', async (req, res) => {
    const { question } = req.body;
    const newQuestion = new Question({
        questionType: question.questionType,
        title: question.title,
        subTitle: question.subTitle,
        // answers: question.answers,
        answersDisplay: question.answersDisplay,
        tags: question.tags
    })
    try{
        await newQuestion.save()
        res.send(newQuestion)
    }catch(err)
    {
        console.log(err);
        res.status(400).send(err)
    }
})


//update question
router.put('/:id', async (req, res) => {
    const { question } = req.body;
    const { id } = req.params
    if(question){
        try {
            const dbQuestion = await Question.findByIdAndUpdate(id, {
                $set: {
                    title: question.title,
                    subTitle: question.subTitle,
                    answers: question.answers,
                    answersDisplay: question.answersDisplay,
                    tags: question.tags
                }
            }, { new: true, useFindAndModify: false });
    
            if(!dbQuestion){
                return res.status(404).send({message: "Question not found"})
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
        if(!deletedQuestion){
            res.status(404).send({ message: "Question not found" });
        }

        res.status(200).send(deletedQuestion)
    } catch (error) {
        res.status(404).send({ message: "Value is Invalid", error })
    }
})

module.exports = router;