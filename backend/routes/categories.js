const express = require('express');
const { getCategories, createCategory, deleteCategory } = require('../controllers/categories');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

const router = express.Router();

router.get('/', authenticateToken, getCategories);
router.post('/', authenticateToken, requireAdmin, createCategory);
router.delete('/:id', authenticateToken, requireAdmin, deleteCategory);

module.exports = router;

