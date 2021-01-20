const mongoose = require('mongoose')
const Joi = require('joi')

const fieldSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 40,
    }
})

const validateField = (field) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(40).required().label('Title')
    })
    return schema.validate(field)
}

const Field = mongoose.model('Field', fieldSchema)

module.exports.Field = Field
module.exports.validateField = validateField