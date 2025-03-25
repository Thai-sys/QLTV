const BookService = require("../services/book.service");

class BookController {
  constructor() {
    this.bookService = new BookService();
  }

  // Lấy danh sách tất cả sách
  async findAll(req, res) {
    try {
      const books = await this.bookService.findAll();

      res.json(books);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sách:", error);
      res.status(500).json({ message: "Lỗi khi lấy danh sách sách!", error });
    }
  }

  // Tìm kiếm sách theo tên
  async searchBook(req, res) {
    const { searchQuery } = req.query;

    try {
      const books = await this.bookService.searchBooksByTitle(searchQuery);
      res.json(books);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sách:", error);
      res.status(500).json({ message: "Lỗi khi tìm kiếm sách!", error });
    }
  }

  // Thêm sách mới (hỗ trợ upload ảnh)
  async addBook(req, res) {
    try {
      const bookData = req.body;

      // Kiểm tra nếu có file ảnh thì lưu đường dẫn
      if (req.file) {
        bookData.url = req.file.originalname;
      }

      const newBook = await this.bookService.addBook(bookData);
      res.status(201).json({ message: "Thêm sách thành công!", book: newBook });
    } catch (error) {
      console.error("Lỗi khi thêm sách:", error);
      res.status(500).json({ message: "Lỗi khi thêm sách!", error });
    }
  }

  // Cập nhật sách theo ID
  async updateBook(req, res) {
    try {
      const bookId = req.params.id;
      const updatedData = req.body;

      // Nếu có file mới được upload, cập nhật đường dẫn ảnh
      if (req.file) {
        updatedData.url = req.file.originalname;
      }

      const updatedBook = await this.bookService.updateBook(
        bookId,
        updatedData
      );

      if (!updatedBook) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy sách để cập nhật!" });
      }

      res.json({ message: "Cập nhật sách thành công!", book: updatedBook });
    } catch (error) {
      console.error("Lỗi khi cập nhật sách:", error);
      res.status(500).json({ message: "Lỗi khi cập nhật sách!", error });
    }
  }

  async deleteBook(req, res) {
    try {
      const bookId = req.params.id;
      const result = await this.bookService.deleteBook(bookId);

      if (result.success) {
        return res.status(200).json({ message: result.message });
      } else {
        return res.status(400).json({ message: result.message });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Lỗi server.", error: error.message });
    }
  }
}

module.exports = BookController;
