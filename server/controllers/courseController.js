const {Course} = require('../models/courses');
const {User} = require('../models/user');
const _ = require('lodash');

exports.getAllCourses = function(req,res) {
    Course.find({}).then(function(courses){
        res.status(200).send(courses);
    }).catch((e) =>{
        res.status(400).send(e);
    })
};

exports.getCoureById = function(req, res){
    Course.findById(req.params.uid).then((course) =>{
        res.status(200).send(course);
    }).catch((e) =>{
        res.status(400).send(e);
    })
};

exports.numbersOfUsersInACourse = function(req,res){
    let body= _.pick(req.body, ['courseName']);

    User.find({courses : courseName}, function(err, users) {
        var userMap = {};
    
        users.forEach(function(user) {
          userMap[user._id] = user;
        });
    
        res.send(userMap.length);  
      });
};