const MongoDB = require("../utils/mongodb.util");

class PublisherService {
  constructor() {
    this.Publisher = null;
  }

  async init() {
    if (!this.Publisher) {
      const db = MongoDB.getDB();
      if (!db) {
        throw new Error("MongoDB connection not initialized!");
      }
      this.Publisher = db.collection("nhaxuatban"); // Collection name in database
    }
  }

  // Lấy tất cả nhà xuất bản từ collection "nhaxuatban"
  async getAllPublishers() {
    try {
      await this.init();

      const publishers = await this.Publisher.find({}).toArray();
 

      return publishers;
    } catch (error) {
      console.error("Error fetching publishers:", error);
      throw new Error("Failed to fetch publishers: " + error.message);
    }
  }
}

module.exports = PublisherService;
