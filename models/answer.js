const mongoose = require('mongoose')

const testSchema = new mongoose.Schema({
    content:{
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true,
    },
    correctAnswer: {
        type: Boolean,
        required: true
    }
})

const Answer = mongoose.model('Answer', testSchema)

module.exports.Answer = Answer 