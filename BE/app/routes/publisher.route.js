const express = require("express");
const PublisherController = require("../controllers/publisher.controller.js");

const router = express.Router();
const publisherController = new PublisherController();

// Route để lấy danh sách nhà xuất bản
router
  .route("/")
  .get((req, res) => publisherController.getAllPublishers(req, res));

module.exports = router;
