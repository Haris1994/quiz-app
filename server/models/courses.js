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
    users : [String],
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

    return _.pick(courseObject, ['name', 'likes']);
};

CourseSchema.statics.insertCourse = function(name,userName){
    let Course = this;

    return Course.findOne({name}).then((course) =>{
        if(!course){
            return Promise.reject();
        }

        return new Promise ((resolve, reject) => {

            let found = user.courses.find(function(element) {
                return element === courseName;
              });

            if(found===courseName){
                console.log('Course already added')
            }
            else{

                user.updateOne({$push :{courses:courseName}}, {new: true}, (err, doc) => {
                    if (doc) {
                        resolve(user);
                    }
                    else{
                        reject();
                    }
                })
            }
        })
            
    }).catch((e) =>{
        console.log(e);
    })
}

let Course = mongoose.model('Course', CourseSchema);

module.exports = {Course};