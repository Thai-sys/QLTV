const UserService = require("../services/user.service");

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async getAllUsers(req, res) {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy danh sách người dùng!",
        error: error.message,
      });
    }
  }

  async searchUser(req, res) {
    try {
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({ message: "Thiếu tham số email" });
      }

 

      const users = await this.userService.searchUser(email);
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi tìm kiếm người dùng!",
        error: error.message,
      });
    }
  }

  // Xóa người dùng theo ID
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Thiếu ID người dùng!" });
      }

      const result = await this.userService.deleteUser(id);
      if (!result) {
        return res.status(404).json({ message: "Người dùng không tồn tại!" });
      }

      res.status(200).json({ message: "Xóa người dùng thành công!" });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi xóa người dùng!",
        error: error.message,
      });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const userData = req.body;

      if (!id) {
        return res.status(400).json({ message: "Thiếu ID người dùng!" });
      }

      const updatedUser = await this.userService.updateUser(id, userData);
      if (!updatedUser) {
        return res.status(404).json({ message: "Người dùng không tồn tại!" });
      }

      res.status(200).json({
        message: "Cập nhật người dùng thành công!",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Lỗi trong quá trình cập nhật người dùng:", error); 
      res.status(500).json({
        message: "Lỗi khi cập nhật người dùng!",
        error: error.message,
      });
    }
  }

  async getUserProfile(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1]; // Lấy token

      if (!token) {
        return res
          .status(401)
          .json({ message: "Không có token. Vui lòng đăng nhập." });
      }

      // Lấy thông tin người dùng từ token
      const user = await this.userService.getUserByToken(token);

      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng." });
      }


      res.status(200).json(user);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin profile:", error);
      res.status(500).json({
        message: "Lỗi khi lấy thông tin người dùng.",
        error: error.message,
      });
    }
  }


}

module.exports = UserController;
