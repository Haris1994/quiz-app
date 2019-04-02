const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

let QuestionSchema = new mongoose.Schema({
    question : {
        type : String,
        required : true,
        minlength : 1,
        unique : true
    },
    options : [String],
    rightOption : {
        type : String,
        required : true
    }
});