const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const fs = require('fs');



const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/QuizApp');

const {User} = require('./models/user')

const publicPath = path.join(__dirname , '../public');
const port = process.env.PORT || 3000;


const app = express();
app.use(express.static(publicPath));
app.use(bodyParser.json());

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


app.listen(port , () => {
    console.log(`Server is running on port ${port}`);
})