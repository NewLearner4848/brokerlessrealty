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

// Init upload array
const uploadArray = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).array('images', 10);

// Init upload single
const uploadSingle = multer({
    storage: storage,
    limits: { fileSize: 10000000 },
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('file');

// Check file type
function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype || extname){
        return cb(null, true);
    } else {
        cb(new Error('Error: Images Only!'));
    }
}

// Middleware to handle multer array errors
const handleUpload = (req, res, next) => {
    uploadArray(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};

// Middleware to handle single file upload
const handleSingleUpload = (req, res, next) => {
    uploadSingle(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};

module.exports = { handleUpload, handleSingleUpload };
