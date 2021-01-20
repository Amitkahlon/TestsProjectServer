const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 30,
        required: true
    },
    fields: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Field'
    }]
})

const Organization = mongoose.model('Organization', organizationSchema);

const validateOrganization = (org) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required().label('Name'),
        fields: Joi.array().items(Joi.objectId()).label('Fields')
    })
    return schema.validate(org);
}

module.exports.Organization = Organization;
module.exports.validateOrganization = validateOrganization;