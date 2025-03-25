const AuthService = require("../services/auth.service");
const jwt = require("jsonwebtoken");



class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async checkEmail(req, res) {
    const { email } = req.body;
    console.log("Received email:", email); // In email nhận được từ client
    try {
      const isEmailExist = await this.authService.checkEmail(email);
      if (isEmailExist) {
        console.log("Email đã tồn tại:", email); // In ra email nếu đã tồn tại
        return res.status(400).json({ message: "Email đã tồn tại!" });
      }
      console.log("Email hợp lệ:", email); // In ra email nếu hợp lệ
      res.status(200).json({ message: "Email hợp lệ!" });
    } catch (error) {
      console.error("Error in checkEmail controller:", error.stack); // In ra lỗi chi tiết
      res
        .status(500)
        .json({ message: "Lỗi khi kiểm tra email!", error: error.message });
    }
  }

  // Đăng ký người dùng mới
  async register(req, res) {
    const { email, hoTen, sdt, diaChi, password, ngaySinh } = req.body;

    const userData = {
      email,
      hoTen,
      sdt,
      diaChi,
      ngaySinh: ngaySinh || null,
      password,
    };

    try {
      const newUser = await this.authService.register(userData);
      res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Lỗi khi đăng ký người dùng!", error: error.message });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      // Xác thực email và mật khẩu
      const user = await this.authService.authenticate(email, password);

      if (!user) {
        return res
          .status(400)
          .json({ message: "Email hoặc mật khẩu không đúng!" });
      }

      // Tạo token
      const token = jwt.sign(
        { id: user._id, email: user.email, hoTen:user.hoTen, },
        "SECRET_KEY",
        {
          expiresIn: "1h",
        }
      );

     
      res.cookie("accessToken", token, {
        maxAge: 60 * 60 * 1000, // 1 giờ
      });

      res.status(200).json({ message: "Đăng nhập thành công!", user });
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      res
        .status(500)
        .json({ message: "Lỗi khi đăng nhập!", error: error.message });
    }
  }

  async adminlogin(req, res) {
    const { email, password } = req.body;

    try {
      const user = await this.authService.adminAuthenticate(email, password);

      if (!user) {
        return res
          .status(400)
          .json({ message: "Email hoặc mật khẩu không đúng!" });
      }

      // Tạo token
      const token = jwt.sign(
        { id: user._id, email: user.email, hoTen:user.hoTen, },
        "SECRET_KEY",
        {
          expiresIn: "1h",
        }
      );

      // Lưu token vào cookies
      res.cookie("accessToken", token, {
        maxAge: 60 * 60 * 1000, 
      });

      res.status(200).json({ message: "Đăng nhập thành công!", user });
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      res
        .status(500)
        .json({ message: "Lỗi khi đăng nhập!", error: error.message });
    }
  }
}

module.exports = AuthController;
