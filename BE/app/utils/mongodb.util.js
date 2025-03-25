const { MongoClient } = require("mongodb");

class MongoDB {
  static client;
  static db;

  static async connect(uri) {
    if (!this.client) {
      this.client = new MongoClient(uri); // Loại bỏ useNewUrlParser và useUnifiedTopology
      await this.client.connect(); // Kết nối MongoDB
      console.log(" Đã kết nối MongoDB!");
      this.db = this.client.db("Project"); // Chọn đúng database
    }
    return this.db;
  }

  static getDB() {
    if (!this.db) {
      throw new Error(
        " Chưa kết nối MongoDB! Hãy gọi MongoDB.connect(uri) trước."
      );
    }
    return this.db;
  }
}

module.exports = MongoDB;
