const bcrypt = require('bcryptjs');
const File = require('../models/File');
const generateShareCode = require('../utils/generateLink');

// @desc    Create a share link for a file
// @route   POST /api/share/:fileId
exports.createShareLink = async (req, res, next) => {
  try {
    const { password, expiresIn } = req.body;

    const file = await File.findOne({
      _id: req.params.fileId,
      ownerId: req.user.id,
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found.' });
    }

    // Generate unique share code
    let shareCode = generateShareCode();
    // Ensure uniqueness
    while (await File.findOne({ shareLink: shareCode })) {
      shareCode = generateShareCode();
    }

    // Set expiry
    let expiresAt = null;
    if (expiresIn) {
      const now = new Date();
      switch (expiresIn) {
        case '1h':
          expiresAt = new Date(now.getTime() + 60 * 60 * 1000);
          break;
        case '1d':
          expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          break;
        case '7d':
          expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        default:
          expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Default 1 day
      }
    }

    // Hash password if provided
    let passwordHash = null;
    if (password) {
      const salt = await bcrypt.genSalt(12);
      passwordHash = await bcrypt.hash(password, salt);
    }

    file.shareLink = shareCode;
    file.expiresAt = expiresAt;
    file.passwordHash = passwordHash;
    await file.save();

    res.json({
      message: 'Share link created successfully.',
      shareLink: shareCode,
      shareUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/share/${shareCode}`,
      expiresAt,
      isPasswordProtected: !!password,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get shared file info (public)
// @route   GET /api/share/:shareCode
exports.getSharedFile = async (req, res, next) => {
  try {
    const file = await File.findOne({ shareLink: req.params.shareCode });

    if (!file) {
      return res.status(404).json({ message: 'Shared file not found or link is invalid.' });
    }

    // Check expiry
    if (file.expiresAt && new Date() > file.expiresAt) {
      return res.status(410).json({ message: 'This share link has expired.' });
    }

    res.json({
      file: {
        id: file._id,
        originalName: file.originalName,
        fileSize: file.fileSize,
        mimeType: file.mimeType,
        uploadDate: file.uploadDate,
        virusStatus: file.virusStatus,
        aiSummary: file.aiSummary,
        isPasswordProtected: !!file.passwordHash,
        expiresAt: file.expiresAt,
        downloadCount: file.downloadCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify password for shared file
// @route   POST /api/share/:shareCode/verify
exports.verifyPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const file = await File.findOne({ shareLink: req.params.shareCode });

    if (!file) {
      return res.status(404).json({ message: 'Shared file not found.' });
    }

    if (file.expiresAt && new Date() > file.expiresAt) {
      return res.status(410).json({ message: 'This share link has expired.' });
    }

    if (!file.passwordHash) {
      return res.json({ verified: true });
    }

    const isMatch = await bcrypt.compare(password, file.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    res.json({ verified: true });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove share link
// @route   DELETE /api/share/:fileId
exports.removeShareLink = async (req, res, next) => {
  try {
    const file = await File.findOne({
      _id: req.params.fileId,
      ownerId: req.user.id,
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found.' });
    }

    file.shareLink = null;
    file.passwordHash = null;
    file.expiresAt = null;
    await file.save();

    res.json({ message: 'Share link removed.' });
  } catch (error) {
    next(error);
  }
};
