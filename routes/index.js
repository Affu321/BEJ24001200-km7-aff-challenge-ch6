const express = require('express');
const router = express.Router();
const multerUpload = require('../libs/multerUpload');
const HandleImage = require('../controllers/handleImage');

router.post('/images', multerUpload.array('images'), HandleImage.uploadImage);
router.get('/images', HandleImage.getImage)


module.exports = router;
