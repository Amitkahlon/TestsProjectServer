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
    field:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Field',
        required: true
    },
    answersDisplay: {
        type: String,
        enum: ['horizontal', 'vertical'],
        required: true
    },
    tags: [{
        type: String,
        minlength: 2, 
        maxlength: 40,
        required: false
    }],
    LastEdited:{
        type: Date,
        required: true
    }
})

const Question = mongoose.model('Question', questionSchema)

const validateQuestion = (question) => {
    const schema = Joi.object({
        questionType: Joi.string().required().label('Question type'),
        title: Joi.string().min(3).max(100).required().label('Title'),
        subTitle: Joi.string().optional().allow('').max(50).label('Sub title'),
        correctAnswers: Joi.array().min(1).required().items(Joi.string()).label('Correct answer(s)'),
        incorrectAnswers: Joi.array().min(1).required().items(Joi.string()).label('Incorrect answer(s)'),
        field: Joi.objectId().required().label('Field'),
        answersDisplay: Joi.string().required().label('Answer Display'),
        tags: Joi.array().items(Joi.string()).min(0).max(40).label('Tags')
    })
    return schema.validate(question, { abortEarly: false });
}

module.exports.Question = Question;
module.exports.validateQuestion = validateQuestion;