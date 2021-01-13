const mongoose = require('mongoose')
const Joi = require('joi')

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 30,
        required: true
    }
})

const Organization = mongoose.model('Organization', organizationSchema);

const validateOrganization = (org) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required()
    })
    return schema.validate(org);
}

module.exports.Organization = Organization;
module.exports.validateOrganization = validateOrganization;