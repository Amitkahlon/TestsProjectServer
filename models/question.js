const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    title:{
        type: String,
        minlength: 3,
        maxlength: 25,
        required: true
    }
})

const Question = mongoose.model('Question', questionSchema)

module.exports.Question = Question 