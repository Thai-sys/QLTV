const CategoryService = require("../services/category.service.js");

class CategoryController {
  constructor() {
    this.categoryService = new CategoryService();
  }

  // Lấy danh sách thể loại
  async getAllCategories(req, res) {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories!", error });
    }
  }
}

module.exports = CategoryController;
