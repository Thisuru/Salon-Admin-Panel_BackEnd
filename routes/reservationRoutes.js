const express = require('express');
const { reservationGetAll, reservationCreatePost, reservationGetSingle, reservationDelete, reservationUpdate, getAllReservationCountController, getCompletedReservationCountController, updateStatus } = require('../controllers/ReservationController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, reservationGetAll);
router.get('/allcount', getAllReservationCountController)
router.get('/completedcount', getCompletedReservationCountController)
router.post('/', reservationCreatePost);
router.get('/:id', reservationGetSingle);
router.put("/status", updateStatus);
router.put('/:id', reservationUpdate);
router.delete('/:id', reservationDelete);

module.exports = router;