const express = require('express');
const { deleteOrg, updateOrg, getOrgById, getUserOrgs } = require('../bl/orgsService');
const auth = require('../middlewares/auth');
const router = express.Router();
const { Organization, validateOrganization } = require('../models/organization');
const { User } = require('../models/user');

router.get('/', auth, async (req, res) => {
    try{
        const user = await getUserOrgs(req.user._id);
        if(!user || user.organizations === 0) return res.status(404).send({message: 'No organizations found'})
        res.status(200).send(user.organizations);
    }catch(err)
    {
        res.send(400).send(err)
    }
})

router.get('/:id', auth, async (req, res) => {
    const {id} = req.params
    try {
        const organization = await getOrgById(id)
        res.status(200).send({organization});
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

router.put('/:id', auth, async (req, res) => {
    const {id} = req.params
    const {organization} = req.body
    const {error} = validateTest(test)
    if(error) return res.status(400).send(error.details[0].message);
    const updatedOrg = await updateOrg(id, organization)
    if(!updatedOrg) return res.status(404).send({message: "Organization not found."})
    res.status(200).send({test: updatedOrg});
})

router.delete('/:id', auth, async (req, res) => {
    const {id} = req.params
    try {
        const deletedOrg = await deleteOrg(id)
        if(!deletedOrg) return res.status(404).send({ message: "Organization not found" });
        res.status(200).send(deletedOrg)
    } catch (error) {
        res.status(404).send({ message: `Organization with id ${id} not removed`, error })
    }
})

module.exports = router;