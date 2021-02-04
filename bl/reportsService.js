const { func } = require('joi');
const { Question } = require('../models/question');
const { Test } = require('../models/test');
const { Exam } = require('../models/exam');
const { answerIsCorrect } = require("../utilities/utilities");




async function getReportAny(testId,) {
    const test = await Test.findById(testId);
    const exams = await Exam.find({ testId: testId });

    if (test) {
        return await generateTestReport(test, exams, { fromDate: "any", toDate: "any" });
    } else {
        return { message: "test was not found" };
    }
}

async function generateReport(examId) {
    const exam = await Exam.findById(examId);
    const test = await Test.findById(exam.testId).populate("questions");

    const questionsDetails = await generateQuestionDetails(exam.questions);
    const summary = await generateSummary(exam, test);

    return { questionsDetails, summary, exam }
}

async function getReportByDate(testId, fromDate, toDate) {
    const test = await Test.findById(testId);

    const exams = await Exam.find({
        testId: testId,
        createdAt: {
            $gte: new Date(fromDate),
            $lte: new Date(toDate)
        }
    });

    if (test) {
        return await generateTestReport(test, exams, { fromDate, toDate });
    } else {
        return { message: "test was not found" };
    }
}

async function generateQuestionDetails(examQuestions) {
    const questionsDetails = await Promise.all(examQuestions.map(async (examQuestion) => {
        const question = await Question.findById(examQuestion.question.questionId);

        const questionDetail = {
            questionId: question._id,
            questionTitle: question.title,
            answeredCorrectly: answerIsCorrect(examQuestion.answer, question.correctAnswers),
            dateAnswerd: "10/10/2020 placeholder",
            question,
            answerChoosen: examQuestion.answer
        }
        return questionDetail;
    }));

    return questionsDetails;
}

function generateSummary(exam, test) {
    const summary = {
        testName: test.title,
        createdAt: exam.createdAt,
        submissionsCount: getSubmissionsCount(exam.questions),
        testId: test._id,
        correctAnswerCount: getCorrectAnswerCount(exam.questions, test),
        grade: exam.grade,
        questionsCount: test.questions.length,
        status: exam.grade >= test.passGrade ? true : false,
        passingGrade: test.passGrade,
    }

    return summary;
}

function getSubmissionsCount(examQuestions) {
    let i = 0;
    examQuestions.forEach(examQuestion => {
        if (examQuestion.answer.length > 0) {
            i++;
        }
    });

    return i;
}

function getCorrectAnswerCount(examQuestions, test) {
    let answeredCorrectly = 0;

    //if answered correctly
    examQuestions.forEach(examQuestion => {
        const testQuest = test.questions.find(testQuestion => testQuestion._id == examQuestion.question.questionId);

        if (answerIsCorrect(examQuestion.answer, testQuest.correctAnswers)) {
            answeredCorrectly++;
        }
    })

    return answeredCorrectly;
}

const generateTestReport = async (test, exams, dates) => {
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

    return { report: { exams, summary, questionStatistics } };
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



module.exports.getReportByDate = getReportByDate;
module.exports.getReportAny = getReportAny;
module.exports.generateReport = generateReport;
