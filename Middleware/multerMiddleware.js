const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,'Public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname );
  },
});

const productImageUploadMulter = multer({ storage : storage});

module.exports = productImageUploadMulter