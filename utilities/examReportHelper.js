const { Question } = require('../models/question');
const { answerIsCorrect } = require("./utilities");

async function generateQuestionDetails(examQuestions) {
    console.log(examQuestions);
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



module.exports.generateQuestionDetails = generateQuestionDetails;
module.exports.generateSummary = generateSummary;
