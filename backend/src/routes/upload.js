import express from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.js';
import { uploadPhotoToCloudinary, deletePhotoFromCloudinary } from '../services/cloudinaryUpload.js';
import Dossier from '../models/Dossier.js';

const router = express.Router();

// Configure multer to store in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

console.log("This is uploaded "+upload)

/**
 * POST /api/upload/profile-photo
 * Upload profile photo to Cloudinary and update dossier
 * Body: FormData with 'photo' field containing image file and 'dossierId' field
 */
router.post('/profile-photo', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const { dossierId } = req.body;
  console.log('Upload route hit', { file: !!req.file, dossierId: req.body.dossierId });
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    if (!dossierId) {
      return res.status(400).json({ error: 'dossierId is required' });
    }
console.log('File received:', req.file.originalname, 'Dossier ID:', dossierId);
    // Verify dossier belongs to the authenticated user
    console.log('Token se aayi User ID:', req.userId);
console.log('Dossier ID jo search ho rahi hai:', dossierId);

    const dossier = await Dossier.findOne({ _id: dossierId, userId: req.user._id });
    if (!dossier) {
      return res.status(404).json({ error: 'Dossier not found' });
    }
     console.log('Dossier found:', dossier._id);
    // Upload to Cloudinary
    const photoUrl = await uploadPhotoToCloudinary(
      req.file.buffer,
      `${req.userId}-${dossier._id}`
    );
    console.log('Photo uploaded to Cloudinary:', photoUrl);                     

    // Delete old photo if it exists
    if (dossier.profile?.photoUrl) {
      await deletePhotoFromCloudinary(dossier.profile.photoUrl);
    }

    // Update dossier with new photo URL
    dossier.profile = dossier.profile || {};
    dossier.profile.photoUrl = photoUrl;
    await dossier.save();

    res.json({
      success: true,
      photoUrl,
      message: 'Photo uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/upload/profile-photo/:dossierId
 * Remove profile photo from Cloudinary and dossier
 */
router.delete('/profile-photo/:dossierId', authMiddleware, async (req, res) => {
  try {
    const { dossierId } = req.params;

    // Verify dossier belongs to the authenticated user
    const dossier = await Dossier.findOne({ _id: dossierId, userId: req.user._id});
    if (!dossier) {
      return res.status(404).json({ error: 'Dossier not found' });
    }

    if (!dossier.profile?.photoUrl) {
      return res.status(400).json({ error: 'No photo to delete' });
    }

    // Delete from Cloudinary
    await deletePhotoFromCloudinary(dossier.profile.photoUrl);

    // Update dossier
    dossier.profile.photoUrl = undefined;
    await dossier.save();

    res.json({ success: true, message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
