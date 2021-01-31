const express = require('express');
const Joi = require('joi');
const router = express.Router();

router.get('/', async (req, res) => {
    const { testId, fromDate, toDate } = req.query;

    console.log(testId, fromDate, toDate);
    const { error } = reportFormValidtion({ testId, fromDate, toDate });

    console.log(error);

    res.send("hello")



})

router.get('/any', async (req, res) => {
    const testId = req.query.testId;

    console.log(testId);


    // const { error } = reportFormValidtionAnyDate({ testId, fromDate, toDate });

})

const reportFormValidtion = (form) => {
    const schema = Joi.object({
        fromDate: Joi.date().iso().label('From Date'),
        toDate: Joi.date().iso().label('To Date'),
        testId: Joi.string().min(9).max(9).required().label('Test Id'),
    })
    return schema.validate(form, {
        abortEarly: false
    })
}

const reportFormValidtionAnyDate = (testId) => {
    const schema = Joi.string().min(9).max(9).required().label('Test Id')

    return schema.validate(testId, {
        abortEarly: false
    })
}

module.exports = router