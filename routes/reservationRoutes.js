const express = require('express');
const { reservationGetAll, reservationCreatePost, reservationGetSingle, reservationDelete, reservationUpdate } = require('../controllers/ReservationController');

const router = express.Router();

router.get('/', reservationGetAll);
router.post('/', reservationCreatePost);
router.get('/:id', reservationGetSingle);
router.put('/:id', reservationUpdate);
router.delete('/:id', reservationDelete);

module.exports = router;