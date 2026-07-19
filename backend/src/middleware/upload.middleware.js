const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = './public/uploads/';

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage engine
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).array('images', 10); // 'images' is the field name in FormData, limit to 10 files

// Check file type
function checkFileType(file, cb){
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif|webp/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    } else {
        cb(new Error('Error: Images Only!'));
    }
}

// Middleware to handle multer errors gracefully
const handleUpload = (req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return res.status(400).json({ message: err.message });
        } else if (err) {
            // An unknown error occurred when uploading.
            return res.status(400).json({ message: err.message });
        }
        // Everything went fine.
        next();
    });
};

module.exports = handleUpload;
