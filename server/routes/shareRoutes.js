const express = require('express');
const router = express.Router();
const {
  createShareLink,
  getSharedFile,
  verifyPassword,
  removeShareLink,
} = require('../controllers/shareController');
const auth = require('../middleware/auth');

// Protected routes (owner only)
router.post('/:fileId', auth, createShareLink);
router.delete('/:fileId', auth, removeShareLink);

// Public routes (anyone with the link)
router.get('/:shareCode', getSharedFile);
router.post('/:shareCode/verify', verifyPassword);

module.exports = router;
