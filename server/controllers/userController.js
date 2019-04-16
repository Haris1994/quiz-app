const {User} = require('../models/user');
const _ = require('lodash');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const formidable = require('formidable');


exports.uploadPhoto = function(req, res) {
    let id = req.params.uid;
    let form = new formidable.IncomingForm();
    form.uploadDir = "./public/images";
    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024;
    form.parse(req, (err, fields, file) =>{
        if(err){
            res.status(400).send('Some error occured');
        }

        User.findByIdAndUpdate(id, {$set :{"image" : file.photo.path}}, {new: true}, (err, doc) => {
            if (doc) {
                res.redirect('http://localhost:3000/Account.html');
            }
            else{
                res.status(400).send('Some error occured');
            }
        })
        
        // User.findOne({"_id" : id}).then((user) =>{
        //     if(!user){
        //         res.status(400).send('No user Found');
        //     }
        //     user.updateOne({$set:{"image":file.photo.path}}, {new: true}, (err, doc) =>{
        //         if (doc) {
        //             res.redirect('http://localhost:3000/Account.html');
        //         }
        //         else{
        //             res.status(400).send('Some error occured');
        //         }
        //     })
            
        // })

    })
    
};

exports.register = function(req,res) {
    let body = _.pick(req.body, ['name', 'email','password']);
    let user = new User(body);

        user.save().then(() => {
            res.status(200).send(user);
        }).catch ((e) => {
            res.status(400).send(e);
        }); 
};

exports.login = function(req,res){
    let body = _.pick(req.body , ['email','password']);
    let email = body.email;
    let password = body.password;

    const findByCredentials = function(email,password){

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

    findByCredentials(body.email, body.password).then((user) => {
        res.status(200).send(user);
    }).catch((e) => {   
        res.status(400).send(e);
    });
};

exports.updateCourse = function(req,res) {

    const insertCourse = function(name,courseName,totalQuestions){
    let progres = {
        "course" : courseName,
        "totalQuestions" : JSON.parse(totalQuestions)
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
                User.findOneAndUpdate({"name" : name, "progress.course": courseName}, {$set : {"progress.$.totalQuestions" : totalQuestions}}, {new : true}, (err,doc) =>{
                    if(doc){
                        resolve(user)
                    }else{
                        reject();
                    }
                })
                
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
    let body = _.pick(req.body, ['name', 'courseName', 'totalQuestions']);
    insertCourse(body.name, body.courseName, body.totalQuestions).then((user) =>{
        res.status(200).send(user);
    }).catch((e) =>{
        res.status(400).send(e);
    })
};

exports.updateSubject = function(req,res){
    let body = _.pick(req.body, ['userId', 'courseName', 'answer']);

    if(body.answer){
        User.updateOne({"_id": body.userId, "progress.course" : body.courseName} , {$inc : {"progress.$.completedQuestions" : 1, "progress.$.score" : 1}}, {new:true})
    .then((doc) =>{
        res.status(200).send(doc);
    }).catch((e) =>{
        res.status(400).send(e);
    })
    }else{
    User.updateOne({"_id": body.userId, "progress.course" : body.courseName} , {$inc : {"progress.$.completedQuestions" : 1}}, {new:true})
    .then((doc) =>{
        res.status(200).send(doc);
    }).catch((e) =>{
        res.status(400).send(e);
    })
}
};

exports.updateUser = function(req,res) {

    let userUpdate = function(id,changeName, changeEmail){
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

    let body = _.pick(req.body, ['id', 'changeName', 'changeEmail']);
    userUpdate(body.id, body.changeName, body.changeEmail).then((user) =>{
        res.status(200).send(user);
    }).catch((e) =>{
        res.status(400).send(e);
    })

};

exports.findUserById = function(req, res){
    User.findById(req.params.uid).then((user) =>{
        res.status(200).send(user);
    }).catch((e) =>{
        res.status(400).send(e);
    })
};

exports.getMe = function(req,res){
    res.send(req.user);
};