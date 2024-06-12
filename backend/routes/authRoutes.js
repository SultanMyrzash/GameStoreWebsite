const express = require('express');
const router = express.Router();
const cors = require('cors');
const { test, registerUser, loginUser, getProfile } = require('../controllers/authController');

router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173',
    })

)

router.get('/test', test);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/profile', getProfile)

module.exports = router;