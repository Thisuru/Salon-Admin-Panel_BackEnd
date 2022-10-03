const express = require('express');
const { stylistGetAll ,stylistCreatePost, getAvailableStylish, getEachStylistTimePerDay} = require('../controllers/StylistController');

const router = express.Router();

router.get('/', stylistGetAll);
router.post('/', stylistCreatePost);
router.post("/getAvailableStylish", getAvailableStylish);
router.post("/getEachStylistTime", getEachStylistTimePerDay);

module.exports = router;