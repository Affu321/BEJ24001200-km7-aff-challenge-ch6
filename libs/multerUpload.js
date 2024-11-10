const multer = require('multer')

const upload = multer({
    limits: {fileSize:10485760},
    fileFilter: (req, file,cb)=>{
        const allowedTypes = ['image/jpeg', 'image/jpg', 'video/mp4'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true)
        }else{
            cb(new Error("Only JPEG, JPG, and MP4 formats are allowed."), false);
        }
    }
});
module.exports = upload;
