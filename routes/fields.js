const express = require('express');
const auth = require('../middlewares/auth');
const {Field, validateField} = require('../models/field');
const { Organization } = require('../models/organization');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const org = await Organization.findById(req.user.organization).populate('fields')
        res.send({fields: org.fields}).status(200)
    } catch (error) {
        res.send({message: 'No fields found', error}).status(404)
    }
})

router.post('/', auth, async (req, res) => {
    const {field} = req.body
    const {error} = validateField(field)
    if(error) return res.send(error.details[0].message).status(403)
    const newField = new Field({
        title: field.title
    })
    try {
        let save = await newField.save()
        if(save){
            res.send({field: newField}).status(200)
            const org = await Organization.findById(req.user.organization)
            org.fields.push(newField._id)
            await org.save()
        }
    } catch (err) {
        res.send(err).status(403)
    }
})

module.exports = router