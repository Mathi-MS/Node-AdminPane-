const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // or wherever you store uploads
  },
  filename: function (req, file, cb) {
    const name = path.parse(file.originalname).name.replace(/\s+/g, '-'); // sanitize filename
    const ext = path.extname(file.originalname);
    const timestamp = Date.now();
    cb(null, `${name}-${timestamp}${ext}`);
  }
});

const upload = multer({ storage });

module.exports = upload;
