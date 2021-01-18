const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const jwt = require('jsonwebtoken');

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
    organizations: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Organization'
    }]
});

const validateUser = (user) => {
    const schema = Joi.object({
        email: Joi.string().required().email().label('Email'),
        password: Joi.string().min(6).max(14).required().label('Password'),
        organizations: Joi.array().items(Joi.objectId()).min(1).required().label('Organization(s)')
    })
    return schema.validate(user)
}

userSchema.methods.generateAuthToken = function (org) {
    return jwt.sign({_id: this._id, email: this.email, organization: org}, process.env.JWT_SECRET);
}

const User = mongoose.model('User', userSchema)

module.exports.User = User
module.exports.validateUser = validateUser