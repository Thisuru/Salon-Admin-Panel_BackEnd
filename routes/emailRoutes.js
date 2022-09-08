const express = require('express');
const { sendSuccessEmail } = require('../controllers/EmailController');
 
const router = express.Router();

router.post('/', sendSuccessEmail)

module.exports = router;