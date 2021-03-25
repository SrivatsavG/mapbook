const path = require('path');

const express = require('express');

const userController = require("../controllers/user");
const { Router } = require('express');

const router = express.Router();

//Get use profile

router.post('/:userID/edit', userController.postEdit);

router.post('/:userID/getAllUsers', userController.getAllUsers);

router.post('/:userID/addfriend', userController.postAddFriend);

router.get('/:userID/getMyFriends', userController.getMyFriends);

router.get('/:userID/:user2ID', userController.getUserProfile);

router.get('/:userID', userController.getMyProfile);





module.exports = router;
