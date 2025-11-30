const express = require('express');
const router = express.Router();
const { allLogs, allUsers, updateUser, deleteUser } = require('../controllers/adminController');
const { auth, authorize } = require('../middlewares/auth');

router.get('/attendance', auth, authorize('admin'), allLogs);
router.get('/users', auth, authorize('admin'), allUsers);
router.put('/users/:id', auth, authorize('admin'), updateUser);
router.delete('/users/:id', auth, authorize('admin'), deleteUser);

module.exports = router; 