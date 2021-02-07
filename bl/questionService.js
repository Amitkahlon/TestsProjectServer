const { Question } = require('../models/question');

async function getQuestions(field) {
    const questions = await Question.find({ field })
    return questions;
}

async function getQuestionById(id) {
    const question = await Question.findById(id);
    return question;
}

async function addQuestion(newQuestion) {
    await newQuestion.save()
    return { question: newQuestion };
}

async function editQuestion(id, question) {
    const dbQuestion = await Question.findByIdAndUpdate(id, {
        $set: question
    }, { new: true, useFindAndModify: false });
    return dbQuestion;
}

async function deleteQuestion(id) {
    return await Question.findByIdAndRemove(id, { useFindAndModify: false });
}

module.exports.getQuestions = getQuestions;
module.exports.getQuestionById = getQuestionById;
module.exports.addQuestion = addQuestion;
module.exports.editQuestion = editQuestion;
module.exports.deleteQuestion = deleteQuestion;


// {
//     title: question.title,
//     subTitle: question.subTitle,
//     questionType: question.questionType,
//     correctAnswers: question.correctAnswers,
//     incorrectAnswers: question.incorrectAnswers,
//     answersDisplay: question.answersDisplay,
//     tags: question.tags,
//     field: question.field
// }

