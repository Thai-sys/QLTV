const express = require("express");
const CategoryController = require("../controllers/category.controller.js");

const router = express.Router();
const categoryController = new CategoryController();

// Route để lấy danh sách thể loại
router
  .route("/")
  .get((req, res) => categoryController.getAllCategories(req, res));

module.exports = router;
