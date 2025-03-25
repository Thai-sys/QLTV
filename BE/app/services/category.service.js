const MongoDB = require("../utils/mongodb.util");

class CategoryService {
  constructor() {
    this.Category = null;
  }

  async init() {
    if (!this.Category) {
      const db = MongoDB.getDB();
      if (!db) {
        throw new Error("MongoDB connection not initialized!");
      }
      this.Category = db.collection("theloai"); // Collection name in database
    }
  }

  // Lấy tất cả thể loại từ collection "theloai"
  async getAllCategories() {
    try {
      await this.init();
 

      const categories = await this.Category.find({}).toArray();


      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Failed to fetch categories: " + error.message);
    }
  }
}

module.exports = CategoryService;
