const express = require("express");
const AuthController = require("../controllers/auth.controller.js");

const router = express.Router();
const authController = new AuthController(); // Khởi tạo instance

router
  .route("/check-email")
  .post((req, res) => authController.checkEmail(req, res));

router.route("/register").post((req, res) => authController.register(req, res));

//  đăng nhập
router.route("/login").post((req, res) => authController.login(req, res));
//  đăng nhập QT
router
  .route("/adminlogin")
  .post((req, res) => authController.adminlogin(req, res));

module.exports = router;
