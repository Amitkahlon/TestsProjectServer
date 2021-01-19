const mongoose = require('mongoose')
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


const questionSchema = new mongoose.Schema({
    questionType: {
        type: String,
        enum: ["SingleChoiceQuestion", "MultipleSelectionQuestion"],
        required: true
    },
    title:{
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true,
    },
    subTitle: {
        type: String, 
        minlength: 3, 
        maxlength: 50,
        required: false
    },
    correctAnswers: {
        type: [String],
        minlength: 3,
        maxlength: 150,
        required: true,
        validate: {
            validator: function (an) {
                return an && an.length > 0;
            },
            message: "A correct answers should have at least 1 answer."
        }
    },
    incorrectAnswers: {
        type: [String],
        minlength: 3,
        maxlength: 150,
        required: true,
        validate: {
            validator: function (an) {
                return an && an.length > 0;
            },
            message: "An incorrect answers should have at least 1 answer."
        }
    },
    organization:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    answerDisplay: {
        type: String,
        enum: ['Horizontal', 'Vertical'],
        required: true
    },
    tags: [{
        type: String,
        minlength: 2, 
        maxlength: 15,
        required: false
    }]
})

const Question = mongoose.model('Question', questionSchema)

const validateQuestion = (question) => {
    const schema = Joi.object({
        questionType: Joi.string().required().label('Question type'),
        title: Joi.string().min(3).max(50).required().label('Title'),
        subTitle: Joi.string().min(3).max(50).label('Sub title'),
        correctAnswers: Joi.array().min(1).required().items(Joi.string()).label('Correct answer(s)'),
        incorrectAnswers: Joi.array().min(1).required().items(Joi.string()).label('Incorrect answer(s)'),
        organization: Joi.objectId().required().label('Organization'),
        answerDisplay: Joi.string().required().label('Answer Display'),
        tags: Joi.array().items(Joi.string()).min(2).max(15).label('Tags')
    })
    return schema.validate(question);
}

module.exports.Question = Question;
module.exports.validateQuestion = validateQuestion;