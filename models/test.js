const mongoose = require('mongoose')
const Joi = require('joi');
const joiObjectid = require('joi-objectid');
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
        required: true,
        validate: {
            validator: function (qs) {
                return qs && qs.length > 0;
            },
            message: "A test should have at least 1 question"
        }
    }],
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    }
});
const emailExpression = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const validateTest = (test) =>{
    const schema = Joi.object({
        title: Joi.string().min(5).max(200).required(),
        description: Joi.string().min(0).max(300),
        authorEmail: Joi.string().pattern(emailExpression).required(),
        passGrade: Joi.number().min(0).max(100).required(),
        showCorrectAnswers: Joi.bool().required(),
        questions: Joi.array().min(1).required(),
        organization: Joi.objectId().required()
    })
    return schema.validate(test);
}

const Test = mongoose.model('Test', testSchema)

module.exports.Test = Test
module.exports.validateTest = validateTest