import multer from 'multer';
import path from 'path';
import DataURIParser from 'datauri/parser.js';
import { cloudinary } from './config/cloudinaryConfig.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { log } from 'console';

const parser = new DataURIParser()
// const storage = new CloudinaryStorage({
//       cloudinary: cloudinary,
//       params: {
//           folder: "DEV",
//       public_id: (req, file) => req?.file?.originalname,
//     },
//   });
  const limits = {
    fileSize: 10 * 1024 * 1024, // 5MB
  };
const storage = multer.memoryStorage();
const Uploads = multer({ storage, limits }).single('image');

const multerUploads = (req, res, next) => {
  Uploads(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size limit exceeded' });
      }
      // Handle other Multer errors if needed
      return res.status(400).json({ error: 'Upload failed' });
    } else if (err) {
      // An unknown error occurred during upload
      console.error(err);
      return res.status(500).json({ error: 'Upload failed' });
    }

    next(); // Call the next middleware or route handler
  });
};


const uploadToCloudinary = async (req) => {
  try { 
    console.log(req,`file bUFFERR`);

    const __fileBuffer = parser.format(path.extname(req.file.originalname).toString(),req.file.buffer)
    // console.log(__fileBuffer,"_______buffer response..");
  
    const result = await cloudinary.uploader.upload(__fileBuffer.content, {
      folder: 'DEV', // Specify the folder in which to store the file
      // Additional upload options
    });

    // Return the public URL of the uploaded file
    return result.secure_url;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};



export { uploadToCloudinary, multerUploads };