const MongoDB = require("../utils/mongodb.util"); // MongoDB helper để kết nối với database
const bcrypt = require("bcrypt");

class AuthService {
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

  // Lấy collection tùy theo tham số truyền vào (docgia hoặc nhanvien)
  async getCollection(collectionName) {
    await this.init();
    return this.db.collection(collectionName);
  }

  async checkEmail(email) {

    try {
      const docGiaCollection = await this.getCollection("docgia");
      const user = await docGiaCollection.findOne({ email: email });
     
      return user !== null;
    } catch (error) {
      console.error("Error in checkEmail service:", error.stack);
      throw new Error("Lỗi khi kiểm tra email: " + error.message);
    }
  }

  async register(userData) {
    try {
      const docGiaCollection = await this.getCollection("docgia");

      const saltRounds = 10;
      userData.password = await bcrypt.hash(userData.password, saltRounds);

      const result = await docGiaCollection.insertOne(userData);
      return { ...userData, _id: result.insertedId };
    } catch (error) {
      throw new Error("Lỗi khi đăng ký người dùng: " + error.message);
    }
  }

  async authenticate(email, password) {
    try {
      const docGiaCollection = await this.getCollection("docgia");

      const user = await docGiaCollection.findOne({ email: email });
      if (!user) {
        console.log("Không tìm thấy user");
        return null;
      }

      const isMatch = await bcrypt.compare(password, user.password);
 

      return isMatch ? user : null;
    } catch (error) {
      throw new Error("Lỗi khi xác thực người dùng: " + error.message);
    }
  }

  async adminAuthenticate(email, password) {
    try {
      const nhanVienCollection = await this.getCollection("nhanvien");

      const user = await nhanVienCollection.findOne({ email: email });
      if (!user) {
        console.log("Không tìm thấy nhân viên");
        return null;
      }

      const isMatch = await bcrypt.compare(password, user.password);
 

      return isMatch ? user : null;
    } catch (error) {
      throw new Error("Lỗi khi xác thực nhân viên: " + error.message);
    }
  }
}

module.exports = AuthService;
