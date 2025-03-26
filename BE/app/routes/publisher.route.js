const express = require("express");
const PublisherController = require("../controllers/publisher.controller.js");

const router = express.Router();
const publisherController = new PublisherController();

// Lấy danh sách nhà xuất bản
router.get("/", (req, res) => publisherController.getAllPublishers(req, res));

// Thêm nhà xuất bản mới
router.post("/", (req, res) => publisherController.addPublisher(req, res));

// Cập nhật thông tin nhà xuất bản
router.put("/:id", (req, res) => publisherController.updatePublisher(req, res));

// Xóa nhà xuất bản
router.delete("/:id", (req, res) =>
  publisherController.deletePublisher(req, res)
);

module.exports = router;
