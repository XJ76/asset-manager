const express = require('express');
const { createOrganization } = require('../controllers/organizations');
const { getAllOrganizations } = require('../controllers/organizations');

const router = express.Router();

router.post('/', createOrganization);
router.get('/', getAllOrganizations);

module.exports = router;
