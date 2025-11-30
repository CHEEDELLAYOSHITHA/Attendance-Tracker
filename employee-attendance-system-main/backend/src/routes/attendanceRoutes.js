const express = require('express');
const router = express.Router();
const { checkIn, checkOut, myLogs } = require('../controllers/attendanceController');
const { auth } = require('../middlewares/auth');

router.post('/checkin', auth, checkIn);
router.post('/checkout', auth, checkOut);
router.get('/me', auth, myLogs);

module.exports = router; 