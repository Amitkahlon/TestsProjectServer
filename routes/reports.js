const express = require('express');
const { getReportByDate, generateExamReport, getReportAny, reportFormValidtion, reportFormValidtionAnyDate} = require("../bl/reportsService");
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

router.get('/any', auth, async (req, res) => {
    try {
        const testId = req.query.testId;
        const { error } = reportFormValidtionAnyDate(testId);

        if (error) {
            console.error(error)
            return res.send({ message: error })
        };

        const report = await getReportAny(testId);

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

router.get('/exam', auth, async (req, res) => {
    try {
        const { examId } = req.query;
        if (!examId) {
            return res.send({ message: "examId cannot be empty" })
        }

        const report = await generateExamReport(examId);

        res.send({ report });

    } catch (error) {
        res.send({ message: error });
    }
});


module.exports = router