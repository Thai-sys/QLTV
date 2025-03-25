const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Cấu hình nơi lưu file và giữ nguyên tên gốc nếu chưa tồn tại
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/anh_sach"); // Thư mục lưu ảnh
  },
  filename: function (req, file, cb) {
    const filePath = path.join("public/anh_sach", file.originalname);

    // Kiểm tra nếu file đã tồn tại thì giữ nguyên tên cũ
    if (fs.existsSync(filePath)) {
      cb(null, file.originalname); // Giữ nguyên tên gốc
    } else {
      cb(null, file.originalname); // Lưu với tên gốc
    }
  },
});

// Bộ lọc file, chỉ cho phép ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ hỗ trợ định dạng ảnh (JPEG, PNG, GIF)!"), false);
  }
};

// Khởi tạo multer middleware
const upload = multer({ storage, fileFilter });

module.exports = upload;
