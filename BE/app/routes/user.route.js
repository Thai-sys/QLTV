const express = require("express");
const UserController = require("../controllers/user.controller.js");

const router = express.Router();
const userController = new UserController();

// Lấy danh sách người dùng
router.get(
  "/users",
  async (req, res) => await userController.getAllUsers(req, res)
);

// Tìm kiếm người dùng theo email
router.get(
  "/search",
  async (req, res) => await userController.searchUser(req, res)
);

// Xóa người dùng theo ID
router.delete(
  "/deleteUser/:id",
  async (req, res) => await userController.deleteUser(req, res)
);

// Cập nhật thông tin người dùng theo ID
router.put(
  "/updateUser/:id",
  async (req, res) => await userController.updateUser(req, res)
);

// Lấy thông tin profile người dùng
router.get("/profile", async (req, res) => await userController.getUserProfile(req, res));




module.exports = router;
