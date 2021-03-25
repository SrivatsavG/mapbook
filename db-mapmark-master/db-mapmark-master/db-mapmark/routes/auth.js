const path = require('path');
 
const express = require('express');
 
const authController = require("../controllers/auth")
 
const router = express.Router();

//Post sign in
router.post('/signIn',authController.postSignIn);

//Post sign in
router.post('/signUp',authController.postSignUp)

 
module.exports = router;
 