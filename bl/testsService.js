const { Test } = require("../models/test");

async function getTests(field) {
    const foundTests = await Test.find({ field }).populate('questions field')
    return foundTests;
}

async function updateTest(id) {
    const test = await Test.findByIdAndUpdate(id, {
        $set: {
            title: test.title,
            description: test.description,
            passGrade: test.passGrade,
            showCorrectAnswers: test.showCorrectAnswers,
            questions: test.questions,
            field: test.field,
            passMessage: test.passMessage,
            failMessage: test.failMessage,
            language: test.language,
            modifiedAt: Date.now()
        }
    }, { new: true, useFindAndModify: false })
    return test;
}

async function deleteTest(id) {
    const test = await Test.findByIdAndRemove(id, { useFindAndModify: false })
    return test;
}

module.exports.getTests = getTests;
module.exports.updateTest = updateTest;
module.exports.deleteTest = deleteTest;