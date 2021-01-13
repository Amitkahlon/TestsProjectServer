const mongoose = require('mongoose')

const testSchema = new mongoose.Schema({
    title:{
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true,
    },
})

const Test = mongoose.model('Test', testSchema)

module.exports.Test = Test 