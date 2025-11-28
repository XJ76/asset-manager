const express = require('express');
const { getAssets, createAsset, updateAsset, deleteAsset } = require('../controllers/assets');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, getAssets);
router.post('/', authenticateToken, createAsset);
router.put('/:id', authenticateToken, updateAsset);
router.delete('/:id', authenticateToken, deleteAsset);

module.exports = router;

