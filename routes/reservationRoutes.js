const express = require('express');
const { reservationGetAll, reservationCreatePost, reservationGetSingle, reservationDelete, reservationUpdate, getAllReservationCountController, getCompletedReservationCountController } = require('../controllers/ReservationController');

const router = express.Router();

router.get('/', reservationGetAll);
router.get('/allcount', getAllReservationCountController)
router.get('/completedcount', getCompletedReservationCountController)
router.post('/', reservationCreatePost);
router.get('/:id', reservationGetSingle);
router.put('/:id', reservationUpdate);
router.delete('/:id', reservationDelete);

module.exports = router;