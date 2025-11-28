const express = require('express');
const { createOrganization } = require('../controllers/organizations');

const router = express.Router();

router.post('/', createOrganization);

module.exports = router;

