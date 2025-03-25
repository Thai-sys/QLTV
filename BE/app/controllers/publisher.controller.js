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
}

module.exports = PublisherController;
