const express = require('express');
const router = express.Router();
const {
  createFolder,
  getFolders,
  renameFolder,
  deleteFolder,
} = require('../controllers/folderController');
const auth = require('../middleware/auth');

router.use(auth);

router.route('/')
  .get(getFolders)
  .post(createFolder);

router.route('/:id')
  .put(renameFolder)
  .delete(deleteFolder);

module.exports = router;
