const express = require("express");
const EmployeeController = require("../controllers/employee.controller.js");

const router = express.Router();
const employeeController = new EmployeeController();

// Lấy danh sách nhân viên
router.get("/", (req, res) => employeeController.getAllEmployees(req, res));

// Thêm nhân viên mới
router.post("/", (req, res) => employeeController.createEmployee(req, res));

// Cập nhật thông tin nhân viên
router.put("/:id", (req, res) => employeeController.updateEmployee(req, res));

// Xóa nhân viên
router.delete("/:id", (req, res) =>
  employeeController.deleteEmployee(req, res)
);

module.exports = router;
