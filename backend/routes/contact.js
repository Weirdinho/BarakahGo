const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Contact form route (public — no auth needed)
router.post('/', contactController.sendContact);

module.exports = router;