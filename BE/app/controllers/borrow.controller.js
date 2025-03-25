const BorrowService = require("../services/borrow.service.js");
const { ObjectId } = require("mongodb"); // Import ObjectId
class BorrowController {
  constructor() {
    this.borrowService = new BorrowService();
  }

  async getAllBorrows(req, res) {
    try {
      const borrows = await this.borrowService.getAllBorrows();
      res.status(200).json(borrows);
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy danh sách mượn sách!",
        error: error.message,
      });
    }
  }

  async createBorrow(req, res) {
    try {
      const borrowData = req.body;
      const newBorrow = await this.borrowService.createBorrow(borrowData);
      res.status(201).json({
        message: "Tạo giao dịch mượn sách thành công!",
        borrow: newBorrow,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi tạo giao dịch mượn sách!",
        error: error.message,
      });
    }
  }
  async deleteBorrow(req, res) {
    try {
      const { id } = req.params; // Lấy id từ tham số trong URL
      const objectId = new ObjectId(id); // Chuyển id thành ObjectId

      const result = await this.borrowService.deleteBorrow(objectId);

      if (!result) {
        return res.status(404).json({
          message: "Không tìm thấy giao dịch mượn sách với ID này!",
        });
      }

      res.status(200).json({
        message: "Giao dịch mượn sách đã được xóa thành công!",
        borrowId: id,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi xóa giao dịch mượn sách!",
        error: error.message,
      });
    }
  }

  // Cập nhật trạng thái "Đang mượn" khi duyệt yêu cầu mượn sách
  async approveBorrow(req, res) {
    try {
      // Lấy id từ req.params và chuyển nó thành ObjectId
      const { id } = req.params;
      const objectId = new ObjectId(id); // Chuyển id thành ObjectId


      // Gọi dịch vụ để cập nhật trạng thái mượn sách
      const updatedBorrow = await this.borrowService.approveBorrow(objectId);

      res.status(200).json({
        message: "Duyệt mượn sách thành công!",
        borrow: updatedBorrow,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi duyệt mượn sách!",
        error: error.message,
      });
    }
  }

  // Cập nhật trạng thái "Đã trả" khi trả sách
  async returnBook(req, res) {
    try {
      // Lấy id từ req.params và chuyển nó thành ObjectId
      const { id } = req.params;
      const objectId = new ObjectId(id); // Chuyển id thành ObjectId
      // Gọi dịch vụ để cập nhật trạng thái trả sách
      const updatedBorrow = await this.borrowService.returnBook(objectId);

      res.status(200).json({
        message: "Cập nhật trạng thái trả sách thành công!",
        borrow: updatedBorrow,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi cập nhật trạng thái trả sách!",
        error: error.message,
      });
    }
  }

  async createBorrowService(req, res) {
    try {
      const { docgia_id, sach_id, soLuong, donGia, ngayPhaiTra } = req.body;
   
      // Kiểm tra nếu thiếu dữ liệu quan trọng
      if (!docgia_id || !sach_id || !soLuong || !donGia || !ngayPhaiTra) {
        return res.status(400).json({
          message: "Thiếu thông tin quan trọng trong yêu cầu!",
        });
      }

      // Thêm vào dịch vụ để lưu trữ giao dịch mượn sách
      const borrowData = {
        docgia_id,
        sach_id,
        soLuong,
        donGia,
        ngayPhaiTra,
        borrowedAt: new Date(),
        returned: false, // Đặt trạng thái mặc định là chưa trả
      };

      const newBorrow = await this.borrowService.createBorrow(borrowData);
      res.status(201).json({
        success: true,
        message: "Tạo giao dịch mượn sách thành công!",
        borrow: newBorrow,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi tạo giao dịch mượn sách!",
        error: error.message,
      });
    }
  }

  // Lấy danh sách sách đã mượn của một người dùng theo user_id
  async getBorrowedBooksByUser(req, res) {
    try {
      const { id } = req.params;
      
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          message: "ID người dùng không hợp lệ!",
        });
      }

      const borrowedBooks = await this.borrowService.getBorrowedBooksByUser(
        new ObjectId(id)
      );

      res.status(200).json(borrowedBooks);
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy danh sách sách đã mượn!",
        error: error.message,
      });
    }
  }
}

module.exports = BorrowController;
