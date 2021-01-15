const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');

router.post('/', async (req, res) => {
    const {user} = req.body
    const { error } = validate(user);
    if (error) return res.status(400).send(error.details[0].message);
    let foundUser = await User.findOne({email: user.email});
    if(!user) return res.status(400).send({message: 'Invalid email or password.'})
    try {
        const validatePass = await bcrypt.compare(user.password, foundUser.password);
        if(!validatePass) return res.status(400).send({message: 'Invalid email or password.'})
        const token = foundUser.generateAuthToken();
        res.status(200).header('x-auth-token', token).send({token: true});
    } catch (ex) {
        res.status(400).send({message: 'Invalid email or password.'});
    }
});

const validate = (user) =>{
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().min(6).max(14).required()
    })
    return schema.validate(user);
}

module.exports = router