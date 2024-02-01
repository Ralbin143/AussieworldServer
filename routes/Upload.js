const express = require('express');
const { uploadImages, deleteImages } = require('../controller/upload');
const { upload } = require('../middlewares/fileupload');

const router = express.Router();

// Handle document uploads
router.post('/upload', upload.array('files'),uploadImages);

// Handle document deletions
router.delete('/delete/:id', deleteImages);

module.exports = router;
