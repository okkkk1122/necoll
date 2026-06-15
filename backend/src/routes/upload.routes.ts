import { Router } from 'express';
import multer from 'multer';
import { authenticate, requireRole } from '../middleware/auth';
import { minioService } from '../services/minio.service';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
      'video/mp4', 'video/webm', 'video/quicktime',
    ];
    cb(null, allowed.includes(file.mimetype));
  },
});

router.post(
  '/',
  authenticate,
  requireRole('SUPER_ADMIN', 'ADMIN', 'MANAGER'),
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

      const folder = (req.body.folder as string) || 'general';
      const url = await minioService.upload(req.file, folder);

      res.json({
        url,
        publicUrl: minioService.getPublicUrl(url),
        filename: req.file.originalname,
        size: req.file.size,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      res.status(500).json({ error: message });
    }
  }
);

router.post(
  '/multiple',
  authenticate,
  requireRole('SUPER_ADMIN', 'ADMIN', 'MANAGER'),
  upload.array('files', 10),
  async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files?.length) return res.status(400).json({ error: 'No files uploaded' });

      const folder = (req.body.folder as string) || 'general';
      const results = await Promise.all(
        files.map(async (file) => ({
          url: await minioService.upload(file, folder),
          filename: file.originalname,
        }))
      );

      res.json({ files: results });
    } catch (error) {
      res.status(500).json({ error: 'Upload failed' });
    }
  }
);

export default router;
