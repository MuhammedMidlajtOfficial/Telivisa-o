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

const fileFilter = function (req, file, callback) {
  var ext = path.extname(file.originalname);
  if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
    return callback(new Error('Only images are allowed'))
  }
  callback(null, true)
}

const productImageUploadMulter = multer({ storage : storage , fileFilter : fileFilter });

module.exports = productImageUploadMulter