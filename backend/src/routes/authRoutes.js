const express = require('express');
const router = express.Router();
const { signup, login, getMe, checkUsername } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

// Public endpoints
router.post('/signup', signup);
router.post('/login', login);
router.get('/check-username', checkUsername);

// Protected endpoints
router.get('/me', authenticateToken, getMe);

module.exports = router;
