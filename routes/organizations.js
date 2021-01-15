const express = require('express');
const router = express.Router();
const { Organization, validateOrganization } = require('../models/organization')

router.get('/', async (req, res) => {
    try{
        const orgs = await Organization.find().sort({name: 1})
        if(!orgs || orgs.length === 0) return res.status(404).send({message: 'No organizations found'})
        res.status(200).send(tests);
    }catch(err)
    {
        res.send(400).send(err)
    }
})

router.get('/:id', async (req, res) => {
    const {id} = req.params
    try {
        const org = await Organization.findById(id)
        res.status(200).send(org);
    } catch (error) {
        res.status(404).send({message: "No organization was found", error})
    }
})

router.post('/', async (req, res) => {
    const {organization} = req.body
    const {error} = validateOrganization(organization)
    if(error) return res.status(400).send(error.details[0].message);
    const newOrg = new Organization({
        name: organization.name
    });
    try {
        await newOrg.save();
        res.status(200).send({organization: newOrg});
    } catch (error) {
        res.status(400).send(error);
    }
})

router.put('/:id', async (req, res) => {
    const {id} = req.params
    const {organization} = req.body
    const {error} = validateTest(test)
    if(error) return res.status(400).send(error.details[0].message);
    const updatedOrg = await Test.findByIdAndUpdate(id, {
        $set:{
            name: organization.name
        }
    }, {new:true, useFindAndModify: false})
    if(!updatedOrg) return res.status(404).send({message: "Organization not found."})
    res.status(200).send({test: updatedOrg});
})

router.delete('/:id', async (req, res) => {
    const {id} = req.params
    try {
        const deletedOrg = await Test.findByIdAndRemove(id, { useFindAndModify: false })
        if(!deletedOrg) return res.status(404).send({ message: "Organization not found" });
        res.status(200).send(deletedOrg)
    } catch (error) {
        res.status(404).send({ message: `Organization with id ${id} not removed`, error })
    }
})

module.exports = router;