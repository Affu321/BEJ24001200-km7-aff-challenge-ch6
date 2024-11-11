const express = require('express');
const router = express.Router();
const multerUpload = require('../libs/multerUpload');
const HandleImage = require('../controllers/handleImage');
const handleImage = require('../controllers/handleImage');



router.post('/images', multerUpload.array('images'), HandleImage.uploadImage);
router.get('/images', HandleImage.getImage)
router.put('/images/:id', multerUpload.single('file'), HandleImage.updateImage);
router.delete('/images/:id', HandleImage.deleteImage)


module.exports = router;
