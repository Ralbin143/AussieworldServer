// const multer = require("multer")
// const path = require('path')
// const fs = require('fs') 

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const destinationFolder = file.mimetype.startsWith('image') ? 'images' : 'pdfs';
//         cb(null, path.join(__dirname, `../public/${destinationFolder}/`));
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//         cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//     }
// });


// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image') || file.mimetype.startsWith('application/pdf')) {
//     cb(null, true);
//   } else {
//     cb({ message: 'Unsupported file format' }, false);
//   }
// };

// const uploadPhoto = multer({
//   storage: storage,
//   fileFilter: multerFilter,
//   limits: { fileSize: 100000000 },
// });


// module.exports = { uploadPhoto }
// server.js

const multer = require('multer');
const path = require('path');



// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// // Express middleware to handle file upload
// app.post('/upload', upload.array('files'), async (req, res) => {
//   try {
//     const files = req.files.map(file => ({
//       fileName: file.filename,
//       filePath: file.path,
//     }));

//     // Store file details in MongoDB
//     await File.insertMany(files);

//     res.status(200).json({ message: 'Files uploaded successfully!' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

module.exports={upload}