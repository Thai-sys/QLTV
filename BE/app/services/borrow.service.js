const MongoDB = require("../utils/mongodb.util");
const { ObjectId } = require("mongodb");

class BorrowService {
  async getCollection() {
    const db = MongoDB.getDB();
    if (!db) throw new Error("Chưa kết nối MongoDB!");
    return db.collection("theodoimuonsach");
  }

  async getAllBorrows() {
    const collection = await this.getCollection();
    const now = new Date(); // Ngày hiện tại

    // Lấy danh sách mượn sách
    const borrows = await collection.find().toArray();

    for (let borrow of borrows) {
      const ngayPhaiTra = new Date(borrow.ngayPhaiTra);
      let soNgayTre = 0;
      let tienPhat = 0;

      // Tính số ngày trễ hạn
      if (now > ngayPhaiTra) {
        soNgayTre = Math.ceil((now - ngayPhaiTra) / (1000 * 60 * 60 * 24)); // Chuyển đổi mili giây -> ngày
        tienPhat = soNgayTre * 100000; // Mỗi ngày trễ phạt 100,000
      }

      // Cập nhật tiền phạt vào collection `theodoimuonsach`
      await collection.updateOne(
        { _id: borrow._id },
        { $set: { tienPhat: tienPhat } }
      );
    }

    const updatedBorrows = await collection
      .aggregate([
        {
          $addFields: {
            sach_id: { $toObjectId: "$sach_id" },
            docgia_id: { $toObjectId: "$docgia_id" },
          },
        },
        {
          $lookup: {
            from: "sach",
            localField: "sach_id",
            foreignField: "_id",
            as: "sach_info",
          },
        },
        { $unwind: { path: "$sach_info", preserveNullAndEmptyArrays: true } },

        {
          $lookup: {
            from: "docgia",
            localField: "docgia_id",
            foreignField: "_id",
            as: "docgia_info",
          },
        },
        { $unwind: { path: "$docgia_info", preserveNullAndEmptyArrays: true } },

        {
          $project: {
            _id: 1,
            docgia_id: 1,
            sach_id: 1,
            soLuong: 1,
            donGia: 1,
            ngayPhaiTra: 1,
            ngayMuon: 1,
            returned: 1,
            tienPhat: 1,
            trangThai: 1,
            tenSach: "$sach_info.tenSach",
            hoTen: "$docgia_info.hoTen",
          },
        },
      ])
      .toArray();

    return updatedBorrows;
  }

  async deleteBorrow(borrowId) {
    const collection = await this.getCollection();

    // Xóa giao dịch mượn sách bằng borrowId
    const result = await collection.deleteOne({ _id: new ObjectId(borrowId) });

    // Kiểm tra nếu không xóa được (khi không tìm thấy giao dịch)
    if (result.deletedCount === 0) {
      throw new Error("Giao dịch không tồn tại hoặc đã bị xóa trước đó!");
    }

    return {
      message: "Giao dịch mượn sách đã được xóa thành công",
      borrowId: borrowId,
    };
  }

  async createBorrow(borrowData) {
    try {
      const today = new Date();
      const collection = await this.getCollection();
      const newBorrowData = {
        ...borrowData,
        sach_id: new ObjectId(borrowData.sach_id), // Chuyển sach_id thành ObjectId
        docgia_id: new ObjectId(borrowData.docgia_id), // Chuyển docgia_id thành ObjectId
        ngayMuon: today,
        trangThai: "Yêu cầu mượn",
        tienPhat: 0,
      };

      const result = await collection.insertOne(newBorrowData);

      // Trả về dữ liệu vừa tạo
      return { _id: result.insertedId, ...newBorrowData };
    } catch (error) {
      // Log lỗi nếu có
      console.error("Lỗi khi tạo giao dịch mượn sách:", error.message);
      throw error;
    }
  }

  async approveBorrow(borrowId) {
    const collection = await this.getCollection();
    const objectId = new ObjectId(borrowId);
    const result = await collection.findOneAndUpdate(
      { _id: objectId },
      { $set: { trangThai: "Đang mượn" } },
      {}
    );

    return {
      message: "Duyệt mượn sách thành công",
      data: result.value,
    };
  }

  async returnBook(borrowId) {
    const collection = await this.getCollection();

    const objectId = new ObjectId(borrowId);

    const result = await collection.findOneAndUpdate(
      { _id: objectId },
      { $set: { trangThai: "Đã trả" } }
    );
    console.log("Đã trả sách thành công:", result.value);

    return {
      message: "Trả sách thành công",
      data: result.value,
    };
  }
  async getBorrowedBooksByUser(userId) {
    const collection = await this.getCollection();

    try {
      const borrowedBooks = await collection
        .aggregate([
          {
            $match: { docgia_id: new ObjectId(userId) },
          },
          {
            $lookup: {
              from: "sach",
              localField: "sach_id",
              foreignField: "_id",
              as: "sach_info",
            },
          },
          {
            $unwind: "$sach_info",
          },
          {
            $project: {
              _id: 1,
              docgia_id: 1,
              sach_id: 1,
              tienPhat: 1,
              ngayMuon: 1,
              ngayPhaiTra: 1,
              trangThai: 1,
              soLuong: 1,
              tenSach: "$sach_info.tenSach",
            },
          },
        ])
        .toArray();

      return borrowedBooks;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sách đã mượn:", error.message);
      throw new Error("Không thể lấy danh sách sách đã mượn!");
    }
  }
}

module.exports = BorrowService;
