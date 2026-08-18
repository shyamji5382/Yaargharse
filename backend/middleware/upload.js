const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB per photo

function makeStorage(folder) {
  const dest = path.join(__dirname, "..", "uploads", folder);
  fs.mkdirSync(dest, { recursive: true });

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dest),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, unique);
    }
  });
}

function fileFilter(req, file, cb) {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return cb(new Error("Only JPG, PNG, or WEBP images are allowed"));
  }
  cb(null, true);
}

const messUpload = multer({
  storage: makeStorage("messes"),
  fileFilter,
  limits: { fileSize: MAX_SIZE }
});

const roomUpload = multer({
  storage: makeStorage("rooms"),
  fileFilter,
  limits: { fileSize: MAX_SIZE }
});

const vehicleUpload = multer({
  storage: makeStorage("vehicles"),
  fileFilter,
  limits: { fileSize: MAX_SIZE }
});

const buySellUpload = multer({
  storage: makeStorage("buysell"),
  fileFilter,
  limits: { fileSize: MAX_SIZE }
});

const libraryUpload = multer({
  storage: makeStorage("libraries"),
  fileFilter,
  limits: { fileSize: MAX_SIZE }
});

const serviceUpload = multer({
  storage: makeStorage("services"),
  fileFilter,
  limits: { fileSize: MAX_SIZE }
});

const studentHelpUpload = multer({
  storage: makeStorage("studenthelp"),
  fileFilter,
  limits: { fileSize: MAX_SIZE }
});

module.exports = { messUpload, roomUpload, vehicleUpload, buySellUpload, libraryUpload, serviceUpload, studentHelpUpload };
