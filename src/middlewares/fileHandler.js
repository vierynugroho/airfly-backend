import multer from 'multer';
import { ErrorHandler } from './error.js';

const allowedImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];
const maxFileSize = 2 * 1024 * 1024;

const multerConfig = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxFileSize },
  fileFilter: (req, file, cb) => {
    if (!allowedImageTypes.includes(file.mimetype)) {
      return cb(
        new ErrorHandler(
          400,
          `Invalid file type. Only ${allowedImageTypes.join(', ')} are allowed.`
        ),
        false
      );
    }
    cb(null, true);
  },
});

const fileHandlerMiddleware = multerConfig.fields([
  { name: 'image', maxCount: 1 }, // Hanya mengizinkan satu file dengan field name 'image'
]);

export default fileHandlerMiddleware;
