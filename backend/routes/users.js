const express = require('express');
const { getUsers, approveUser, rejectUser } = require('../controllers/users');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

const router = express.Router();

router.get('/', authenticateToken, requireAdmin, getUsers);
router.patch('/:id/approve', authenticateToken, requireAdmin, approveUser);
router.patch('/:id/reject', authenticateToken, requireAdmin, rejectUser);

module.exports = router;

