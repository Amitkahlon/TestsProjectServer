const express = require('express');
const Joi = require('joi');
const { Exam } = require('../models/exam');
const { Test } = require('../models/test');
const { Question } = require('../models/question');
const { answerIsCorrect } = require("../utilities/utilities");
const { generateQuestionDetails, generateSummary } = require("../utilities/examReportHelper");

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { testId, fromDate, toDate } = req.query;
        const { error } = reportFormValidtion({ testId, fromDate, toDate });

        if (error) {
            console.error(error)
            return res.send({ message: error })
        };

        const test = await Test.findById(testId);

        const exams = await Exam.find({
            testId: testId,
            createdAt: {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            }
        });

        if (test) {
            await sendTestReport(test, exams, { fromDate, toDate }, res);
        } else {
            res.send({ message: "test was not found" })
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

        const test = await Test.findById(testId);
        const exams = await Exam.find({ testId: testId });

        if (test) {
            await sendTestReport(test, exams, { fromDate: "any", toDate: "any" }, res);
        } else {
            res.send({ message: "test was not found" })
        }


    } catch (err) {
        console.log(err);
        res.send({ message: err });
    }
})

router.get('/exam', async (req, res) => {
    try {
        const { examId } = req.query;
        const exam = await Exam.findById(examId);
        const test = await Test.findById(exam.testId).populate("questions");
        
        const report = await generateReport(exam, test);

        res.send({ report });

    } catch (error) {
        res.send({ message: error});
    }
});

const generateReport = async (exam, test) => {
    const questionsDetails = await generateQuestionDetails(exam.questions);
    const summary = await generateSummary(exam, test);

    return { questionsDetails, summary, exam }
}



const sendTestReport = async (test, exams, dates, res) => {
    const passingCount = getPassedCount(exams.map(exam => exam.grade), test.passGrade);
    const averageGrade = getAveregeGrade(exams.map(exam => exam.grade));
    const medianGrade = getMedian(exams.map(exam => exam.grade));

    const questions = await getQuestions(test.questions);
    const questionStatistics = getQuestionsStatistics(questions, exams);

    const summary = {
        testName: test.title,
        fromDate: dates.fromDate,
        toDate: dates.toDate,
        submissionsCount: exams.length,
        testId: test._id,
        respondentPassed: passingCount,
        PassingPrecentage: exams.length !== 0 ? (passingCount / exams.length) * 100 : 0,
        questionsCount: test.questions.length,
        averageGrade,
        passingGrade: test.passGrade,
        medianGrade,
    }

    res.send({ report: { exams, summary, questionStatistics } });
}

const getQuestionsStatistics = (testQuestions, exams) => {

    const testQuestionsStatistics = [];

    testQuestions.forEach(question => {
        const correctAnswersStats = question.correctAnswers.map(answer => {
            return { text: answer, answeredCount: 0 }
        })
        const incorrectAnswersStats = question.incorrectAnswers.map(answer => {
            return { text: answer, answeredCount: 0 }
        })

        testQuestionsStatistics.push({
            questionId: question._id,
            questionTitle: question.title,
            questionTags: question.tags,
            numberOfSubmissions: 0,
            answeredCorrectly: 0,
            correctAnswers: correctAnswersStats,
            incorrectAnswers: incorrectAnswersStats
        });
    });

    exams.forEach(exam => {
        exam.questions.forEach(examQuestion => {
            const testQuest = testQuestionsStatistics.find(testQuest => testQuest.questionId == examQuestion.question.questionId);

            //if answered
            if (examQuestion.answer.length > 0) { //if true, answered
                testQuest.numberOfSubmissions++;

                //if answered correctly
                if (answerIsCorrect(examQuestion.answer, testQuest.correctAnswers.map(ans => ans.text))) {
                    testQuest.answeredCorrectly++;
                }

                //add to answer counter
                examQuestion.answer.forEach(answer => {

                    testQuest.correctAnswers.every((corrAnswer) => {
                        if (corrAnswer.text === answer) {
                            corrAnswer.answeredCount++;
                            return false;
                        }
                        else {
                            return true
                        }
                    });

                    testQuest.incorrectAnswers.every((incorrAnswer) => {
                        if (incorrAnswer.text === answer) {
                            incorrAnswer.answeredCount++;
                            return false;
                        }
                        else {
                            return true
                        }
                    });

                });
            }

        })
    });

    return testQuestionsStatistics;
}

const getQuestions = async (questionsIds) => {
    return await Question.find().where('_id').in(questionsIds).exec();
}

const getPassedCount = (examsGrades, passingGrade) => {
    let counter = 0;
    examsGrades.forEach(grade => {
        if (grade >= passingGrade) {
            counter++;
        };
    });

    return counter;
}

const getAveregeGrade = (examsGrades) => {
    if (examsGrades.length === 0) {
        return 0
    }
    const sum = examsGrades.reduce((accumulator, currentValue) => accumulator + currentValue);
    return (sum / examsGrades.length);
}

const getMedian = (arr) => {
    if (arr.length === 0) {
        return 0;
    }
    arr.sort(function (a, b) { return a - b; });
    var i = arr.length / 2;
    return i % 1 == 0 ? (arr[i - 1] + arr[i]) / 2 : arr[Math.floor(i)];
}

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