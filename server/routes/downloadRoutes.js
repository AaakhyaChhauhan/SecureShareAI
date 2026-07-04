const express = require('express');
const router = express.Router();
const { downloadFile } = require('../controllers/downloadController');

// Public download route
router.post('/:shareCode', downloadFile);

module.exports = router;
