const MongoDB = require("../utils/mongodb.util");
const { ObjectId } = require("mongodb");
const fs = require("fs").promises;
const path = require("path");

class BookService {
  constructor() {
    this.Book = null;
    this.Category = null;
    this.Publisher = null;
    this.BorrowingRecord = null; // Thêm bảng theo dõi mượn sách
  }

  async init() {
    if (
      !this.Book ||
      !this.Category ||
      !this.Publisher ||
      !this.BorrowingRecord
    ) {
      const db = MongoDB.getDB();
      if (!db) {
        throw new Error("Chưa kết nối MongoDB!");
      }
      this.Book = db.collection("sach");
      this.Category = db.collection("theloai");
      this.Publisher = db.collection("nhaxuatban");
      this.BorrowingRecord = db.collection("theodoimuonsach"); // Kết nối với bảng theo dõi mượn sách
    }
  }

  async findAll() {
    try {
      await this.init();

      const aggregationCursor = await this.Book.aggregate([
        {
          $lookup: {
            from: "theloai",
            localField: "theLoai_id",
            foreignField: "_id",
            as: "theLoai_info",
          },
        },
        {
          $lookup: {
            from: "nhaxuatban",
            localField: "nxb_id",
            foreignField: "_id",
            as: "nhaxuatban_info",
          },
        },
        {
          $unwind: {
            path: "$theLoai_info",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$nhaxuatban_info",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            tenSach: 1,
            tacGia: 1,
            url: 1,
            namXuatBan: 1,
            soQuyen: 1,
            donGia: 1,
            theLoai: "$theLoai_info.tenTheLoai",
            nhaxuatban: "$nhaxuatban_info.tenNXB",
            diaChiNXB: "$nhaxuatban_info.diaChi",
            sdtNXB: "$nhaxuatban_info.sdt",
          },
        },
        {
          $lookup: {
            from: "theodoimuonsach",
            localField: "_id",
            foreignField: "sach_id",
            as: "borrowed_info",
          },
        },
        {
          $addFields: {
            count: {
              $sum: {
                $map: {
                  input: "$borrowed_info",
                  as: "borrowed",
                  in: {
                    $cond: {
                      if: { $eq: ["$$borrowed.trangThai", "Đang mượn"] },
                      then: {
                        $toInt: {
                          $ifNull: ["$$borrowed.soLuong", 0], // Kiểm tra nếu `soLuong` null thì cho giá trị 0
                        },
                      },
                      else: 0,
                    },
                  },
                },
              },
            },
          },
        },
      ]);

      const result = await aggregationCursor.toArray();



      if (result.length === 0) {
        console.log("Không có sách nào được tìm thấy.");
      }

      return result;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sách: ", error);
      throw new Error("Lỗi khi lấy danh sách sách: " + error.message);
    }
  }

  async searchBooksByTitle(title) {
    try {
      await this.init();

      const aggregationCursor = await this.Book.aggregate([
        {
          $match: {
            tenSach: { $regex: title, $options: "i" }, // Tìm kiếm không phân biệt chữ hoa/thường
          },
        },
        {
          $lookup: {
            from: "theloai",
            localField: "theLoai_id",
            foreignField: "_id",
            as: "theLoai_info",
          },
        },
        {
          $lookup: {
            from: "nhaxuatban",
            localField: "nxb_id",
            foreignField: "_id",
            as: "nhaxuatban_info",
          },
        },
        {
          $unwind: {
            path: "$theLoai_info",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$nhaxuatban_info",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            tenSach: 1,
            tacGia: 1,
            url: 1,
            namXuatBan: 1,
            soQuyen: 1,
            donGia: 1,
            theLoai: "$theLoai_info.tenTheLoai",
            nhaxuatban: "$nhaxuatban_info.tenNXB",
            diaChiNXB: "$nhaxuatban_info.diaChi",
            sdtNXB: "$nhaxuatban_info.sdt",
          },
        },
        {
          $lookup: {
            from: "theodoimuonsach",
            localField: "_id",
            foreignField: "sach_id",
            as: "borrowed_info",
          },
        },
        {
          $addFields: {
            count: {
              $sum: {
                $map: {
                  input: "$borrowed_info",
                  as: "borrowed",
                  in: {
                    $cond: {
                      if: { $eq: ["$$borrowed.trangThai", "Đang mượn"] },
                      then: { $toInt: "$$borrowed.soLuong" }, // Ép kiểu về số
                      else: 0,
                    },
                  },
                },
              },
            },
          },
        },
      ]);

      const result = await aggregationCursor.toArray();

      if (result.length === 0) {
        console.log("Không có sách nào được tìm thấy.");
      }

      return result;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sách: ", error);
      throw new Error("Lỗi khi tìm kiếm sách: " + error.message);
    }
  }

  async addBook(bookData) {
    await this.init();

    // Chuyển đổi theLoai_id và nxb_id thành ObjectId nếu tồn tại
    if (bookData.theLoai_id) {
      bookData.theLoai_id = new ObjectId(bookData.theLoai_id);
    }
    if (bookData.nxb_id) {
      bookData.nxb_id = new ObjectId(bookData.nxb_id);
    }

    const result = await this.Book.insertOne(bookData);

    // Lấy dữ liệu sách mới thêm vào bằng cách truy vấn lại từ DB
    const newBook = await this.Book.findOne({ _id: result.insertedId });

    return newBook;
  }

  async updateBook(id, updatedData) {
    await this.init();

    // Kiểm tra ID có hợp lệ không
    if (!ObjectId.isValid(id)) {
      console.error("Lỗi: ID không hợp lệ");
      throw new Error("ID sách không hợp lệ.");
    }

    const bookObjectId = new ObjectId(id);
    delete updatedData._id;
    const allowedFields = [
      "tenSach",
      "tacGia",
      "namXuatBan",
      "url",
      "soQuyen",
      "donGia",
      "theLoai_id",
      "nxb_id",
    ];

    const updateFields = {};
    allowedFields.forEach((field) => {
      if (updatedData[field] !== undefined) {
        if (field === "soQuyen" || field === "donGia") {
          updateFields[field] = parseInt(updatedData[field], 10); // Ép kiểu số nguyên
        } else if (field === "theLoai_id" || field === "nxb_id") {
          // Kiểm tra nếu là ObjectId hợp lệ thì mới chuyển đổi
          updateFields[field] = ObjectId.isValid(updatedData[field])
            ? new ObjectId(updatedData[field])
            : updatedData[field];
        } else {
          updateFields[field] = updatedData[field];
        }
      }
    });

    // Kiểm tra nếu không có dữ liệu hợp lệ thì không cập nhật
    if (Object.keys(updateFields).length === 0) {
      throw new Error("Không có dữ liệu hợp lệ để cập nhật.");
    }

    // Cập nhật sách
    const result = await this.Book.findOneAndUpdate(
      { _id: bookObjectId },
      { $set: updateFields },
      { returnDocument: "after", returnNewDocument: true }
    );

    if (!result) {
      console.error("Không tìm thấy sách với ID:", id);
      throw new Error("Không tìm thấy sách để cập nhật.");
    }

    console.log("Cập nhật thành công:", result);
    return result;
  }

  async deleteBook(id) {
    await this.init();

    if (!ObjectId.isValid(id)) {
      console.error("Lỗi: ID không hợp lệ");
      return { success: false, message: "ID sách không hợp lệ." };
    }

    const bookObjectId = new ObjectId(id);

    // Kiểm tra sách có tồn tại không
    const book = await this.Book.findOne({ _id: bookObjectId });
    if (!book) {
      return { success: false, message: "Không tìm thấy sách để xóa." };
    }

    // Kiểm tra xem sách có bản ghi trong theodoimuonsach với trạng thái "Đang mượn" không
    const borrowingRecord = await this.BorrowingRecord.findOne({
      sach_id: bookObjectId,
      trangThai: "Đang mượn",
    });

    if (borrowingRecord) {
      return {
        success: false,
        message: "Không thể xóa sách vì sách đang được mượn.",
      };
    }

    // Xóa ảnh sách nếu tồn tại
    const imagePath = path.join("public", "anh_sach", book.url);


    try {
      await fs.access(imagePath); // Kiểm tra xem file có tồn tại không
      await fs.unlink(imagePath); // Xóa file ảnh

    } catch (err) {
      console.warn(`Ảnh không tồn tại hoặc không thể xóa: ${imagePath}`);
    }

    // Xóa sách khỏi database
    const result = await this.Book.deleteOne({ _id: bookObjectId });

    if (result.deletedCount === 0) {
      return { success: false, message: "Xóa sách không thành công." };
    }

    console.log("Xóa sách thành công:", id);
    return { success: true, message: "Xóa sách thành công.", id };
  }
}

module.exports = BookService;
