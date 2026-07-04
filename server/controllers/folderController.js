const Folder = require('../models/Folder');
const File = require('../models/File');

// @desc    Create new folder
// @route   POST /api/folders
exports.createFolder = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Folder name is required' });
    }

    const folder = await Folder.create({
      name,
      ownerId: req.user.id,
    });

    res.status(201).json(folder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's folders
// @route   GET /api/folders
exports.getFolders = async (req, res, next) => {
  try {
    const folders = await Folder.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
    res.json(folders);
  } catch (error) {
    next(error);
  }
};

// @desc    Rename a folder
// @route   PUT /api/folders/:id
exports.renameFolder = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Folder name is required' });
    }

    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id },
      { name },
      { new: true }
    );

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    res.json(folder);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a folder
// @route   DELETE /api/folders/:id
exports.deleteFolder = async (req, res, next) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, ownerId: req.user.id });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // Unlink files from this folder
    await File.updateMany({ folderId: folder._id }, { folderId: null });

    await folder.deleteOne();
    res.json({ message: 'Folder deleted and files unlinked' });
  } catch (error) {
    next(error);
  }
};
