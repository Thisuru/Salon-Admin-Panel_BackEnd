const express = require('express');
const { reservationGetAll, reservationCreatePost, reservationGetSingle, reservationDelete } = require('../controllers/ReservationController');

const router = express.Router();

router.get('/', reservationGetAll);
router.post('/', reservationCreatePost);
router.get('/:id', reservationGetSingle);
router.delete('/:id', reservationDelete);

module.exports = router;