const express = require('express');
const { reservationGetAll, reservationCreatePost } = require('../controllers/ReservationController');

const router = express.Router();

router.get('/', reservationGetAll);
router.post('/', reservationCreatePost);

module.exports = router;