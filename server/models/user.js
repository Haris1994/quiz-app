const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const fs = require('fs');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minlength : 1,
        unique : true
    },
    email : {
        type : String,
        required : true,
        minlength : 1,
        trim : true,
        unique : true,
        validate : {
            validator : validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password : {
        type : String,
        required: true,
        minlength : 6
    },
    progress : [{
        course : String,
        totalQuestions : Number,
        completedQuestions : {type : Number, default : 0}
    }],
    image: String
});

UserSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['name', '_id', 'email', 'image']);
}

UserSchema.statics.uploadPhoto = function(name, imgData){
    let User = this;

    return User.findOne({name}).then((user) =>{
        if(!user){
            return Promise.reject();
        }
        return new Promise ((resolve , reject) =>{
            user.updateOne({$set:{"image":imgData}}, {new: true}, (err, doc) =>{
                if (doc) {
                    resolve(doc);
                }
                else{
                    reject();
                }
            })
        })
    })
}

UserSchema.statics.insertCourse = function(name,courseName,count){
    let User = this;

    let progres = {
        "course" : courseName,
        "completedQuestions" : JSON.parse(count)
    }
    return User.findOne({name}).then((user) =>{
        if(!user){
            return Promise.reject();
        }

        return new Promise ((resolve, reject) => {

            let found = user.progress.find(function(element) {
                return element.course === courseName;
              });
            
            if(found){
                console.log('Course already added');
                resolve(user);
            }
            else{
                user.updateOne({$push :{"progress":progres}}, {new: true}, (err, doc) => {
                    if (doc) {
                        resolve(doc);
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


UserSchema.statics.updateUser = function(id,changeName, changeEmail){
    let User = this;

    return new Promise ((resolve, reject) => {
            if(validator.isEmail(changeEmail)){
                User.findByIdAndUpdate(id, {$set :{name:changeName , email:changeEmail}}, {new: true}, (err, doc) => {
                    if (doc) {
                        resolve(doc);
                    }
                    else{
                        reject();
                    }
                })
            }else{
                reject();
            }
    })
}

UserSchema.statics.findByCredentials = function(email,password)
{
    let User = this;

    return User.findOne({email}).then((user) => {
        if(!user){
            return Promise.reject();
        }

        return new Promise ((resolve, reject) => {
            bcrypt.compare(password, user.password , (err,res) => {
                
                if(res)
                {
                    resolve(user);
                }
                else{
                    reject();
                }
            })
        })
    })
}


UserSchema.pre('save' , function(next){
    let user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err,hash) => {
                user.password = hash;
                next();
            })
        })
    }else{
        next();
    }
})



let User = mongoose.model('User', UserSchema);

module.exports = {User};