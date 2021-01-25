const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const _ = require('lodash')

router.post('/', async (req, res) => {
    const { user } = req.body
    const { error } = validate(user);
    if (error) return res.send(error.details[0].message).status(400);
    let foundUser = await User.findOne({ email: user.email }).populate('organizations');
    if (!foundUser) return res.send({ message: 'Invalid email or password.' }).status(400)
    try {
        const validatePass = await bcrypt.compare(user.password, foundUser.password);
        if (!validatePass) return res.send({ message: 'Invalid email or password.' }).status(400)
        const token = foundUser.generateAuthToken();
        res.status(200).send({ user: _.pick(foundUser, ['_id', 'email', 'organizations']), token })
    } catch (ex) {
        res.send({ message: 'Invalid email or password.' }).status(400);
    }
});

const validate = (user) => {
    const schema = Joi.object({
        email: Joi.string().required().email().label('Email'),
        password: Joi.string().min(6).max(14).required().label('Password'),
        organization: Joi.any().label('Organization'),
        logged: Joi.bool()
    })
    return schema.validate(user);
}

module.exports = router