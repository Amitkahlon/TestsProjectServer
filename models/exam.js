const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const examSchema = new mongoose.Schema({
    studentId:{
        type: String,
        required: true,
        minlength: 9,
        maxlength: 9
    },
    studentEmail: {
        type: String,
        required: true
    },
    studentFirstName: {
        type: String,
        required: true,
        minlength: 2
    },
    studentLastName:{
        type: String,
        required: true,
        minlength: 2
    },
    class:{
        type: String,
        required: true,
        minlength: 2
    },
    testId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    },
    grade:{
        type: Number,
        default: -1,
    },
    questions: {
        type: Array
    }
})

const Exam = mongoose.model('Exam', examSchema)

const validateExam = (exam) =>{
    const schema = Joi.object({
        studentId: Joi.string().min(9).max(9).required().label('ID'),
        studentEmail: Joi.string().email().required().label('Email'),
        studentFirstName: Joi.string().min(2).required().label('First name'),
        studentLastName: Joi.string().min(2).required().label('Last name'),
        class: Joi.string().min(2).required().label('Class'),
        testId: Joi.objectId().required().label('Test ID'),
        questions: Joi.array().min(1).required().label('Questions')
    })
    return schema.validate(exam, {
        abortEarly: false
    })
}

module.exports.Exam = Exam
module.exports.validateExam = validateExam