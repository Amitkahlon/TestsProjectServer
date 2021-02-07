const { Organization } = require("../models/organization")
const { User } = require("../models/user")

async function getUserOrgs(userId) {
    const user = await User.findById(userId).populate('organizations')
    return user
}

async function getOrgById(id) {
    const organization = await Organization.findById(id)
    return organization
}

async function deleteOrg(id) {
    const organization = await Organization.findByIdAndRemove(id, { useFindAndModify: false })
    return organization
}

async function updateOrg(id, org) {
    const updated = await Organization.findByIdAndUpdate(id, {
        $set:{
            name: org.name
        }
    }, {new:true, useFindAndModify: false})
    return updated;
}

module.exports.getUserOrgs = getUserOrgs;
module.exports.getOrgById = getOrgById;
module.exports.deleteOrg = deleteOrg;
module.exports.updateOrg = updateOrg;