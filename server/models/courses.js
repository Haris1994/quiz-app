const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

let CourseSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minlength : 1,
        unique : true
    },
    questions :[{
        question : {
            type : String,
            required : true,
            unique : true
        },
        options : [String],
        answer : {
            type : String,
            required : true
        },
        completed : Boolean
    }],
    likes : Number
});

CourseSchema.methods.toJSON = function(){
    let course = this;
    let courseObject = course.toObject();

    return _.pick(courseObject, ['_id', 'name', 'questions', 'likes']);
};

let Course = mongoose.model('Course', CourseSchema);

module.exports = {Course};