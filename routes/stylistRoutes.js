const express = require('express');
const StylistController = require('../controllers/StylistController');

const router = express.Router();

router.get('/', StylistController.stylistGetAll);
router.post('/', StylistController.stylistCreatePost);

module.exports = router;