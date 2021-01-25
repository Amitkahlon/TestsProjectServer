const express = require('express');
const router = express.Router();
const { validateUser, User } = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('lodash')
const auth = require('../middlewares/auth');
const { Organization } = require('../models/organization');

router.get('/me', auth, async (req, res) => {
    let {organization} = req.headers
    if(!organization)
        organization = req.user.organization
    try{
        const org = await Organization.findById(organization).populate('fields')
        const user = await User.findById(req.user._id)
        let token = user.generateAuthToken(organization)
        const admin = {user: req.user, organization: org}
        res.send({admin, token}).status(200)
    }catch(err)
    {
        res.send({message: 'No admin found.'}).send(404)
    }
})

router.get('/:id', auth, async (req, res) =>{
    const {id} = req.params
    try {
        const user = await User.findById(id).populate('organizations')
        res.status(200).send(user);
    } catch (error) {
        res.status(404).send({message: "No user was found", error})
    }
})

router.post('/', async (req, res) =>{
    const {user} = req.body
    if(!user) return res.send({message: 'Invalid request'}).status(403)
    const {error} = validateUser(user)
    if(error) return res.status(400).send(error.details[0].message);
    let newUser = await User.findOne({email: user.email})
    if(newUser) return res.status(400).send({message: "User is already exists."})
    let salt = await bcrypt.genSalt(10);
    let hashedPass = await bcrypt.hash(user.password, salt)
    newUser = new User({
        email: user.email,
        password: hashedPass,
        organizations: user.organizations
    }).populate('organizations');
    const token = newUser.generateAuthToken();
    try {
        await newUser.save();
        res.status(200).header('x-auth-token', token).send({user: _.pick(newUser, ['_id', 'email', 'organization'])});
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = router