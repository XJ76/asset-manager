const express = require('express');
const { getDepartments, createDepartment } = require('../controllers/departments');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

const router = express.Router();

router.get('/', authenticateToken, getDepartments);
router.post('/', authenticateToken, requireAdmin, createDepartment);

module.exports = router;

