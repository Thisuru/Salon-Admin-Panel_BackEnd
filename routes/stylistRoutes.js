const express = require('express');
const StylistController = require('../controllers/StylistController');

const router = express.Router();

router.get('/', StylistController.stylistGetAll);
router.post('/', StylistController.stylistCreatePost);
router.post("/getAvailableStylish", StylistController.getAvailableStylish);

module.exports = router;