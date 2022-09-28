const express = require('express');
const { userLogin, 
        userRegister, 
        userGetAll, 
        userDelete, 
        userUpdate, 
        getSingleUser,
        decodeTokenCheckAvailability 
    } = require('../controllers/userController');
    
const { route } = require('./clientRoutes');

const router = express.Router();

router.post('/register', userRegister)
router.post('/login', userLogin)
router.get('/', userGetAll)
router.get('/:id', getSingleUser);
router.delete('/:id', userDelete);
router.put('/:id', userUpdate);
router.post('/decode', decodeTokenCheckAvailability)

module.exports = router;