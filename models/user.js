const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 150
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    }
});

const validateUser = (user) => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().min(6).max(14).required(),
        organization: Joi.objectId().required()
    })
    return schema.validate(user)
}

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({_id: this._id, email: this.email}, process.env.JWT_SECRET);
}

const User = mongoose.model('User', userSchema)

module.exports.User = User
module.exports.validateUser = validateUser