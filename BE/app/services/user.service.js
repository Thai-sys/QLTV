const MongoDB = require("../utils/mongodb.util");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

class UserService {
  constructor() {
    this.db = null;
  }

  async init() {
    if (!this.db) {
      this.db = MongoDB.getDB();
      if (!this.db) {
        throw new Error("Chưa kết nối MongoDB!");
      }
    }
  }

  async getCollection(collectionName) {
    if (!this.db) {
      this.db = MongoDB.getDB();
      if (!this.db) {
        throw new Error("Chưa kết nối MongoDB!");
      }
    }
    return this.db.collection(collectionName);
  }

  async getAllUsers() {
    try {
      const docGiaCollection = await this.getCollection("docgia");
      return await docGiaCollection.find({}).toArray();
    } catch (error) {
      throw new Error("Lỗi khi lấy danh sách người dùng: " + error.message);
    }
  }

  async searchUser(query) {
    try {
      const docGiaCollection = await this.getCollection("docgia");
      const users = await docGiaCollection
        .find({
          email: { $regex: query, $options: "i" },
        })
        .toArray();

      return users;
    } catch (error) {
      console.error("Lỗi trong searchUser:", error);
      throw new Error("Lỗi khi tìm kiếm người dùng!");
    }
  }

  async deleteUser(userId) {
    try {
      // Kiểm tra tính hợp lệ của userId
      if (!ObjectId.isValid(userId)) {
        throw new Error("ID người dùng không hợp lệ.");
      }

      const borrowCollection = await this.getCollection("theodoimuonsach");

      // Kiểm tra xem độc giả có sách đang mượn không
      const hasBorrowedBooks = await borrowCollection.findOne({
        docgia_id: new ObjectId(userId),
        trangThai: "Đang mượn",
      });

      if (hasBorrowedBooks) {
        throw new Error("Độc giả còn dịch vụ mượn sách, không thể xóa.");
      }

      // Nếu không có sách đang mượn, tiến hành xóa người dùng
      const docGiaCollection = await this.getCollection("docgia");
      const result = await docGiaCollection.deleteOne({
        _id: new ObjectId(userId),
      });

      return result.deletedCount > 0;
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error.message);
      throw new Error("Lỗi khi xóa người dùng: " + error.message);
    }
  }

  async updateUser(userId, userData) {
    try {
      const docGiaCollection = await this.getCollection("docgia");

      // Loại bỏ trường _id khỏi userData trước khi cập nhật
      const { _id, ...updateFields } = userData;

      // Các trường hợp hợp lệ để cập nhật
      const allowedFields = ["hoTen", "email", "sdt", "diaChi", "ngaySinh"];

      // Lọc các trường hợp hợp lệ từ userData
      const validUpdateFields = {};
      allowedFields.forEach((field) => {
        if (updateFields[field] !== undefined && updateFields[field] !== null) {
          validUpdateFields[field] = updateFields[field];
        }
      });

      if (Object.keys(validUpdateFields).length === 0) {
        throw new Error("Không có dữ liệu hợp lệ để cập nhật.");
      }

      // Cập nhật các trường hợp có giá trị hợp lệ
      const result = await docGiaCollection.findOneAndUpdate(
        { _id: new ObjectId(userId) }, // Dùng ObjectId để tìm theo userId
        { $set: validUpdateFields },
        { returnDocument: "after" }
      );

      if (!result.value) {
        throw new Error("Không tìm thấy người dùng để cập nhật.");
      }

   
      return {
        success: true,
        message: "Cập nhật thành công",
        data: result.value,
      };
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      return {
        success: false,
        message: "Lỗi khi cập nhật người dùng: " + error.message,
      };
    }
  }

  async getUserByToken(token) {
    try {
      const decoded = jwt.verify(token, "SECRET_KEY");

      const docGiaCollection = await this.getCollection("docgia");
      const user = await docGiaCollection.findOne({
        _id: new ObjectId(decoded.id),
      });

      return user;
    } catch (error) {
      console.error("Lỗi khi giải mã token hoặc tìm người dùng:", error);
      throw new Error("Lỗi khi lấy thông tin người dùng.");
    }
  }
}

module.exports = UserService;
