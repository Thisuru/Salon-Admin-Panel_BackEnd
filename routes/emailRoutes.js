const express = require('express');
const { sendSuccessEmail, inviteEmailExpiryToken } = require('../controllers/EmailController');
 
const router = express.Router();

router.post('/', sendSuccessEmail)
router.post('/invitetoken', inviteEmailExpiryToken)

module.exports = router;