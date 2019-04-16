const express = require('express');
const router = express.Router();


const user_controller = require('../controllers/userController');



router.post('/photo/:uid', user_controller.uploadPhoto);
router.post('/register', user_controller.register);
router.post('/login', user_controller.login);
router.patch('/updateCourse', user_controller.updateCourse);
router.patch('/updateSubject' , user_controller.updateSubject);
router.patch('/updateUser' , user_controller.updateUser);
router.get('/getUser/:uid' , user_controller.findUserById);
router.get('/me' , user_controller.getMe);

module.exports = router;