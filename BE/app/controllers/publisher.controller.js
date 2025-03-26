const PublisherService = require("../services/publisher.service.js");

class PublisherController {
  constructor() {
    this.publisherService = new PublisherService();
  }

  // Lấy danh sách nhà xuất bản
  async getAllPublishers(req, res) {
    try {
      const publishers = await this.publisherService.getAllPublishers();
      res.json(publishers);
    } catch (error) {
      console.error("Error fetching publishers:", error);
      res.status(500).json({ message: "Failed to fetch publishers!", error });
    }
  }

  // Thêm nhà xuất bản mới
  async addPublisher(req, res) {
    try {
      const newPublisher = await this.publisherService.addPublisher(req.body);
      res.status(201).json(newPublisher);
    } catch (error) {
      console.error("Error adding publisher:", error);
      res.status(500).json({ message: "Failed to add publisher!", error });
    }
  }

  // Cập nhật nhà xuất bản
  async updatePublisher(req, res) {
    try {
      const updatedPublisher = await this.publisherService.updatePublisher(
        req.params.id,
        req.body
      );
      if (!updatedPublisher) {
        return res.status(404).json({ message: "Publisher not found!" });
      }
      res.json(updatedPublisher);
    } catch (error) {
      console.error("Error updating publisher:", error);
      res.status(500).json({ message: "Failed to update publisher!", error });
    }
  }

  // Xóa nhà xuất bản
  async deletePublisher(req, res) {
    try {
      const deleted = await this.publisherService.deletePublisher(
        req.params.id
      );
      if (!deleted) {
        return res.status(404).json({ message: "Publisher not found!" });
      }
      res.json({ message: "Publisher deleted successfully!" });
    } catch (error) {
      console.error("Error deleting publisher:", error);
      res.status(500).json({ message: "Failed to delete publisher!", error });
    }
  }
}

module.exports = PublisherController;
