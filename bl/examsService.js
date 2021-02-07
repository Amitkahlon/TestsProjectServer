const { Exam } = require("../models/exam");

async function getStudentExam(studentFirstName, studentLastName, studentId){
    const studentExams = await Exam.find({
        studentFirstName,
        studentLastName,
        studentId
    }).populate('testId');
    return studentExams;
}

async function getStudentsByExam() {
    const studentsNamesAndIds = await Exam.aggregate([
        { $group: { _id: { studentId: "$studentId", studentFirstName: "$studentFirstName", studentLastName: "$studentLastName" } } }
    ]);
    return studentsNamesAndIds;
}

async function getExamById(id) {
    const exam = await Exam.findById(id).populate({
        path: 'testId',
        populate: {
            path: 'questions',
        }
    });
    return exam;
}

async function updateExamQuestion(id, title, answer) {
    const exam = await Exam.findOneAndUpdate({ _id: id, "questions.question.title": title }, {
        $set: {
            "questions.$.answer": answer
        }
    }, { useFindAndModify: false, new: true })
    return exam;
}

module.exports.getStudentExam = getStudentExam;
module.exports.getStudentsByExam = getStudentsByExam;
module.exports.getExamById = getExamById;
module.exports.updateExamQuestion = updateExamQuestion;