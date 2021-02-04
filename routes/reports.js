const express = require('express');
const Joi = require('joi');
const { Exam } = require('../models/exam');
const { Test } = require('../models/test');
const { Question } = require('../models/question');
const { getReportByDate, generateReport, getReportAny } = require("../bl/reportsService");
const auth = require('../middlewares/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const { testId, fromDate, toDate } = req.query;
        const { error } = reportFormValidtion({ testId, fromDate, toDate });

        if (error) {
            console.error(error)
            return res.send({ message: error })
        };

        const report = await getReportByDate(testId, fromDate, toDate);
        if (report.message) {
            return res.send({ message });
        } else {
            return res.send(report);
        }

    } catch (err) {
        console.log(err);
        res.send({ message: err });
    }
})

router.get('/any', async (req, res) => {
    try {
        const testId = req.query.testId;
        const { error } = reportFormValidtionAnyDate(testId);

        if (error) {
            console.error(error)
            return res.send({ message: error })
        };

        const report = getReportAny(testId);
        
        if (report.message) {
            return res.send({ message });
        } else {
            return res.send(report);
        }


    } catch (err) {
        console.log(err);
        res.send({ message: err });
    }
})

router.get('/exam', async (req, res) => {
    try {
        const { examId } = req.query;

        const report = await generateReport(examId);

        res.send({ report });

    } catch (error) {
        res.send({ message: error });
    }
});





const reportFormValidtion = (form) => {
    const schema = Joi.object({
        fromDate: Joi.date().iso().label('From Date'),
        toDate: Joi.date().iso().label('To Date'),
        testId: Joi.string().min(9).required().label('Test Id'),
    })
    return schema.validate(form, {
        abortEarly: false
    })
}

const reportFormValidtionAnyDate = (testId) => {
    const schema = Joi.string().min(5).required().label('Test Id')

    return schema.validate(testId, {
        abortEarly: false
    })
}

module.exports = router