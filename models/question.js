const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    questionType: {
        type: String,
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
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer'
    }],
    answersDisplay: {
        type: String,
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

module.exports.Question = Question;