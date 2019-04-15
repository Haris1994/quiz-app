const path = require('path');
const http = require('http');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const _ = require('lodash');
const fs = require('fs');
const usersRouter = require('./routes/user');
const courseRouter = require('./routes/courses');

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

app.use('/user', usersRouter);
app.use('/course' , courseRouter);

app.listen(port , () => {
    console.log(`Server is running on port ${port}`);
})