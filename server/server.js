const path = require('path');
const http = require('http');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const _ = require('lodash');
const fs = require('fs');



const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/QuizApp');

const {User} = require('./models/user');
const {Course} = require('./models/courses');

const publicPath = path.join(__dirname , '../public');
const port = process.env.PORT || 3000;


const app = express();
app.use(express.static(publicPath));
app.use(bodyParser.json());

app.use(multer({ dest: './uploads/'}).single('photo'));

app.post('/user/photo',function(req,res){

    User.uploadPhoto(req.body.name,req.file.path).then((user) =>{
        // fs.readFile('./public/Account.html', null, function(err,data){
        //     if(err){
        //         res.writeHead(404);
        //         res.write('File not found');
        //     }else{
        //         res.write(data);
        //     }
        //     res.end();
        // })
        res.redirect('localhost:3000/Account.html');
    }).catch((e) => {   
        res.status(400).send(e);
    });
   });

app.post('/register', function(req,res) {
    let body = _.pick(req.body, ['name', 'email','password']);
    let user = new User(body);


        user.save().then(() => {
            res.status(200).send(user);
        }).catch ((e) => {
            res.status(400).send(e);
        });   
});

app.post('/login' , function(req,res){
    let body = _.pick(req.body , ['email','password']);


    User.findByCredentials(body.email, body.password).then((user) => {
        res.status(200).send(user);
    }).catch((e) => {   
        res.status(400).send(e);
    });
})

app.patch('/updateCourse', function(req,res){
    let body = _.pick(req.body, ['name', 'courseName']);

    User.insertCourse(body.name, body.courseName).then((user) =>{
        res.status(200).send(user);
    }).catch((e) =>{
        res.status(400).send(e);
    })
})

app.get('/getAllCourses' ,function(req,res){
    Course.find({}).then(function(courses){
        res.status(200).send(courses);
    }).catch((e) =>{
        res.status(400).send(e);
    })
})

app.get('/getCourse/:uid', function(req, res){
    let name = req.headers.data;
    Course.findById(req.params.uid).then((course) =>{
        res.status(200).send(course);
    }).catch((e) =>{
        res.status(400).send(e);
    })
})

app.patch('/updateUser', function(req,res){
    let body = _.pick(req.body, ['id', 'changeName', 'changeEmail']);
    User.updateUser(body.id, body.changeName, body.changeEmail).then((user) =>{
        res.status(200).send(user);
    }).catch((e) =>{
        res.status(400).send(e);
    })
})

app.get('/numberOfUsersInaCourse' , function(req,res){
    let body= _.pick(req.body, ['courseName']);

    User.find({courses : courseName}, function(err, users) {
        var userMap = {};
    
        users.forEach(function(user) {
          userMap[user._id] = user;
        });
    
        res.send(userMap.length);  
      });
})

app.get('/users/me' , function(req,res){
    res.send(req.user);
})

app.listen(port , () => {
    console.log(`Server is running on port ${port}`);
})