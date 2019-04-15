const express = require('express');
const router = express.Router();


const course_controller = require('../controllers/courseController');

router.get('/getAllCourses' , course_controller.getAllCourses);
router.get('/getCourse/:uid' , course_controller.getCoureById);
router.get('/numberOfUsersInaCourse' , course_controller.numbersOfUsersInACourse);

module.exports = router;