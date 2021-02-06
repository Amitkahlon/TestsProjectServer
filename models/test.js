const mongoose = require('mongoose')
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const testSchema = new mongoose.Schema({
    title:{
        type: String,
        minlength: 5,
        maxlength: 200,
        required: true,
    },
    description: {
        type: String,
        minlength: 0,
        maxlength: 300
    },
    authorEmail:{
        type: String,
        required: true
    },
    passGrade: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    showCorrectAnswers: {
        type: Boolean,
        required: true
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    }],
    field: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Field',
        required: true
    },
    passMessage:{
        type: String,
        required: true,
        minlength: 5,
    },
    failMessage:{
        type: String,
        required: true,
        minlength: 5,
    },
    modifiedAt: {
        type: Date,
        default: Date.now()
    },
    language:{
        type: String,
        enum: ['he', 'en'],
        required: true
    }
});

const validateTest = (test) =>{
    const schema = Joi.object({
        title: Joi.string().min(5).max(200).required().label('Title'),
        description: Joi.string().min(0).max(300).label('Description'),
        authorEmail: Joi.string().email().required().label('Author email'),
        passGrade: Joi.number().min(0).max(100).required().label('Pass grade'),
        showCorrectAnswers: Joi.bool().required().label('Show correct answers'),
        questions: Joi.array().items(Joi.objectId()).min(1).required().label('Questions'),
        field: Joi.objectId().required().label('Field'),
        passMessage: Joi.string().min(5).required().label('Pass message'),
        failMessage: Joi.string().min(5).required().label('Fail message'),
        language: Joi.string().required().label('Language'),
    })
    return schema.validate(test, {
        abortEarly: false
    });
}

const Test = mongoose.model('Test', testSchema)

module.exports.Test = Test
module.exports.validateTest = validateTest