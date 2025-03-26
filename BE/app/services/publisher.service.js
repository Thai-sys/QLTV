const MongoDB = require("../utils/mongodb.util");
const { ObjectId } = require("mongodb");

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
      return await this.Publisher.find({}).toArray();
    } catch (error) {
      console.error("Error fetching publishers:", error);
      throw new Error("Failed to fetch publishers: " + error.message);
    }
  }

  async addPublisher(publisherData) {
    try {
      await this.init();
      const result = await this.Publisher.insertOne(publisherData);
      return { ...publisherData, _id: result.insertedId }; // Trả về dữ liệu mới thêm với _id
    } catch (error) {
      console.error("Error adding publisher:", error);
      throw new Error("Failed to add publisher: " + error.message);
    }
  }

  async updatePublisher(id, updatedData) {
    try {
      await this.init();

      // Xóa _id khỏi dữ liệu cập nhật
      delete updatedData._id;

      const result = await this.Publisher.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedData },
        { returnDocument: "after" } // Trả về document sau khi cập nhật
      );

      return result; // Trả về dữ liệu sau khi cập nhật
    } catch (error) {
      console.error("Error updating publisher:", error);
      throw new Error("Failed to update publisher: " + error.message);
    }
  }

  // Xóa nhà xuất bản
  async deletePublisher(id) {
    try {
      await this.init();
      const result = await this.Publisher.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0; // Trả về true nếu xóa thành công
    } catch (error) {
      console.error("Error deleting publisher:", error);
      throw new Error("Failed to delete publisher: " + error.message);
    }
  }
}

module.exports = PublisherService;
