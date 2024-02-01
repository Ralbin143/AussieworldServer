// const path = require('path');
// const fs = require('fs');


// const handleFileUpload = (req, res) => {
  
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ success: false, message: 'No files uploaded' });
//     }

//     // Assuming you want to handle each file individually
//     const uploadedFiles = req.files.map((file) => {
//       const { filename, path: filePath } = file;
      
//       // Process the file as needed, e.g., save the filename or path to a database
//       // In this example, we are just returning the filename and path
//       return { filename, filePath };
      
//     });


//     return res.status(200).json({ success: true, message: 'Files uploaded successfully', uploadedFiles });
//   } catch (error) {
//     console.error('Error processing file uploads:', error);
//     return res.status(500).json({ success: false, message: 'Error processing file uploads', error });
//   }
// };

// module.exports = {handleFileUpload};
const asyncHandler = require('express-async-handler');
const Document = require('../models/User');

const uploadImages = asyncHandler(async (req, res) => {
  try {
    const files = req.files.map(file => ({
      fileName: file.filename,
      filePath: file.path,
    }));

    const userId = {_id:req.body.id}
    const documents ={$set:{
      userDocs:files
    }}

    await Document.findOneAndUpdate(userId,documents); 
    res.status(200).json({ message: 'Files uploaded successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedDocument = await Document.findByIdAndDelete(id);

    if (!deletedDocument) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    fs.unlinkSync(deletedDocument.path);

    return res.json({ success: true, message: 'Deleted', deletedDocument });
  } catch (error) {
    console.error('Error deleting document:', error);
    return res.status(500).json({ success: false, message: 'Error deleting document', error });
  }
});

module.exports = {
  uploadImages,
  deleteImages,
};
