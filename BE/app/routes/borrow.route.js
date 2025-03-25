const express = require("express");
const BorrowController = require("../controllers/borrow.controller.js");

const router = express.Router();
const borrowController = new BorrowController();

// Lấy danh sách các giao dịch mượn sách
router.get(
  "/",
  async (req, res) => await borrowController.getAllBorrows(req, res)
);

// Thêm một giao dịch mượn sách mới
router.post(
  "/",
  async (req, res) => await borrowController.createBorrow(req, res)
);
// Xóa một giao dịch mượn sách
router.delete(
  "/deleteBorrow/:id",
  async (req, res) => await borrowController.deleteBorrow(req, res)
);


// Thêm một giao dịch mượn sách
router.post(
  "/addnewservice", 
  async (req, res) => await borrowController.createBorrowService(req, res)
);

// Cập nhật trạng thái trả sách
router.put("/returned/:id", async (req, res) => await borrowController.returnBook(req, res));

// Cập nhật trạng thái Đang mượn 
router.put("/approve/:id", async (req, res) => await borrowController.approveBorrow(req, res));

// Lấy danh sách sách đã mượn của một người dùng theo user_id
router.get("/borrowed-books/:id", async (req, res) => await borrowController.getBorrowedBooksByUser(req, res));


module.exports = router;
