const express = require('express');
const userController = require('../controllers/userController')
const infoController = require('../controllers/infoController')
const authenticate = require('../middleware/auth')
const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/personalInfo', authenticate, infoController.postPersonalInfo)
router.post('/careerInfo', authenticate, infoController.postCareerInfo)
router.get('/userDetails', authenticate, infoController.getUserDetails)

module.exports=router;