const express = require('express');
const { stylistGetAll ,stylistCreatePost, getAvailableStylish, getEachStylistTimePerWeek, getStylistNameById} = require('../controllers/StylistController');

const router = express.Router();

router.get('/', stylistGetAll);
router.get("/getEachStylistTime", getEachStylistTimePerWeek);
router.get('/:id', getStylistNameById);
router.post('/', stylistCreatePost);
router.post("/getAvailableStylish", getAvailableStylish);

module.exports = router;