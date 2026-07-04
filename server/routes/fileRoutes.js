const express = require('express');
const router = express.Router();
const {
  uploadFile,
  getFiles,
  getFileById,
  deleteFile,
  updateFile,
  getDashboardStats,
} = require('../controllers/fileController');
const { getAnalytics } = require('../controllers/downloadController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', auth, upload.single('file'), uploadFile);
router.get('/stats/dashboard', auth, getDashboardStats);
router.get('/', auth, getFiles);
router.get('/:id', auth, getFileById);
router.put('/:id', auth, updateFile);
router.delete('/:id', auth, deleteFile);
router.get('/:id/analytics', auth, getAnalytics);

module.exports = router;
