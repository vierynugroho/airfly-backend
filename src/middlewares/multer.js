import multer from 'multer';
import { ErrorHandler } from './error.js';

const fileTypes = ['image/jpeg', 'image/jpg', 'image/png'];

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const multerConfig = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    if (fileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ErrorHandler(422, 'Only images (jpeg, jpg, png) are allowed!'));
    }
  },
});

const imageHandlerMiddleware = multerConfig.single('image');
export default imageHandlerMiddleware;
