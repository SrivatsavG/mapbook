const path = require('path');

const express = require('express');

const locationController = require("../controllers/location")

const router = express.Router();


//get-location
router.get('/:locationID', locationController.getLocation);

//Add location
router.post('/:userID/addLocation', locationController.postAddLocation);

//My locations
router.get('/:userID/myLocations', locationController.getMyLocations);

//Get locations
router.post('/:userID/allLocations', locationController.getAllLocations)

module.exports = router;
