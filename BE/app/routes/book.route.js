const express = require("express");
const BookController = require("../controllers/book.controller.js");
const upload = require("../controllers/multer.controller.js");
const router = express.Router();
const bookController = new BookController(); // Khởi tạo instance

// Route để lấy tất cả sách
router.route("/").get((req, res) => bookController.findAll(req, res));

// Route tìm kiếm sách theo tên
router.route("/search").get((req, res) => bookController.searchBook(req, res));

// Route thêm sách
router
  .route("/addBook")
  .post(upload.single("url"), (req, res) => bookController.addBook(req, res));



router
  .route("/updateBook/:id")
  .put(upload.single("url"), (req, res) => bookController.updateBook(req, res));

router
  .route("/deleteBook/:id")
  .delete((req, res) => bookController.deleteBook(req, res));


module.exports = router;
