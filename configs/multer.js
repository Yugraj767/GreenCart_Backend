const multer = require('multer');

const storage = multer.memoryStorage(); // store in memory (no file path issues)

const upload = multer({ storage });

module.exports = upload;

// const cloudinary = require('../configs/cloudinary');

// const uploadFiles = async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ success: false, message: 'No files uploaded' });
//     }

//     // For each file, upload buffer to Cloudinary using `upload_stream`
//     const uploadPromises = req.files.map((file) => {
//       return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { folder: 'your_folder_name' }, // optional folder in Cloudinary
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result.secure_url);
//           }
//         );
//         stream.end(file.buffer);
//       });
//     });

//     const uploadedUrls = await Promise.all(uploadPromises);

//     res.json({ success: true, images: uploadedUrls });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
