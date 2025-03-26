const { ObjectId } = require("mongodb");
const MongoDB = require("../utils/mongodb.util.js");
const bcrypt = require("bcrypt");

class EmployeeService {
  constructor() {
    this.Employee = null;
  }

  async init() {
    if (!this.Employee) {
      const db = MongoDB.getDB();
      if (!db) {
        throw new Error("MongoDB chưa được khởi tạo!");
      }
      this.Employee = db.collection("nhanvien");
    }
  }

  // Lấy tất cả nhân viên
  async getAllEmployees() {
    try {
      await this.init();
      return await this.Employee.find({}).toArray();
    } catch (error) {
      throw new Error("Lỗi khi lấy danh sách nhân viên: " + error.message);
    }
  }

  async createEmployee(employeeData) {
    try {
      await this.init();

      // Kiểm tra password có hợp lệ không
      if (!employeeData.password) {
        throw new Error("Mật khẩu không được để trống");
      }

      // Hash mật khẩu
      const hashedPassword = await bcrypt.hash(employeeData.password, 10);
      employeeData.password = hashedPassword;

      const result = await this.Employee.insertOne(employeeData);
      if (!result.acknowledged) {
        throw new Error("Lỗi khi chèn nhân viên vào database");
      }
      return { _id: result.insertedId, ...employeeData };
    } catch (error) {
      throw new Error("Lỗi khi tạo nhân viên: " + error.message);
    }
  }

  async updateEmployee(id, updatedData) {
    try {
      await this.init();

      // Kiểm tra ID hợp lệ
      if (!ObjectId.isValid(id)) {
        throw new Error("ID không hợp lệ");
      }

      // Xóa _id khỏi dữ liệu cập nhật nếu tồn tại
      if (updatedData._id) {
        delete updatedData._id;
      }

      const result = await this.Employee.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedData },
        { returnDocument: "after" }
      );

    

      return { success: true };
    } catch (error) {
      throw new Error("Lỗi khi cập nhật nhân viên: " + error.message);
    }
  }

  // Xóa nhân viên
  async deleteEmployee(id) {
    try {
      await this.init();
      const result = await this.Employee.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      throw new Error("Lỗi khi xóa nhân viên: " + error.message);
    }
  }
}

module.exports = EmployeeService;
