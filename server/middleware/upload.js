import multer from 'multer';
import path from 'path';

// Define allowed upload directories for different file fields
const uploadDirectories = {
    profilePhoto: 'uploads/profilePhotos',
};

// Set up storage for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Uploading:', file.originalname);
        console.log('Fieldname:', file.fieldname);
        
        const uploadPath = uploadDirectories[file.fieldname];
        
        if (uploadPath) {
            console.log('Saving to:', uploadPath);
            cb(null, uploadPath);
        } else {
            console.error('Invalid file field:', file.fieldname);
            cb(new Error('Invalid file field: ' + file.fieldname));
        }
    },     
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// File type validation
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Images Only!'));
    }
};

// Initialize Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 200 * 1024 * 1024 }, // Limit file size to 2MB
});

export default upload;
