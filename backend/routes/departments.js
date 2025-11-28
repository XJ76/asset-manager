const express = require('express');
const { getDepartments, createDepartment, deleteDepartment } = require('../controllers/departments');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

const router = express.Router();

router.get('/', authenticateToken, getDepartments);
router.post('/', authenticateToken, requireAdmin, createDepartment);
router.delete('/:id', authenticateToken, requireAdmin, deleteDepartment);

module.exports = router;

