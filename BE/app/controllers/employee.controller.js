const EmployeeService = require("../services/employee.service.js");

class EmployeeController {
  constructor() {
    this.employeeService = new EmployeeService();
  }

  // Lấy danh sách nhân viên
  async getAllEmployees(req, res) {
    try {
      const employees = await this.employeeService.getAllEmployees();
      res.json(employees);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhân viên:", error);
      res
        .status(500)
        .json({ message: "Không thể lấy danh sách nhân viên", error });
    }
  }

  // Thêm nhân viên
  async createEmployee(req, res) {
    try {
      const newEmployee = req.body;
      const createdEmployee =
        await this.employeeService.createEmployee(newEmployee);

      res.status(201).json({
        message: "Thêm nhân viên thành công",
        createdEmployee,
      });
    } catch (error) {
      console.error("Lỗi khi thêm nhân viên:", error);
      res.status(500).json({ message: "Không thể thêm nhân viên", error });
    }
  }

  // Cập nhật nhân viên
  async updateEmployee(req, res) {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const updatedEmployee = await this.employeeService.updateEmployee(
        id,
        updatedData
      );
      if (!updatedEmployee) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy nhân viên để cập nhật" });
      }
      res.json({ message: "Cập nhật nhân viên thành công", updatedEmployee });
    } catch (error) {
      console.error("Lỗi khi cập nhật nhân viên:", error);
      res.status(500).json({ message: "Không thể cập nhật nhân viên", error });
    }
  }

  // Xóa nhân viên
  async deleteEmployee(req, res) {
    try {
      const { id } = req.params;
      const deletedEmployee = await this.employeeService.deleteEmployee(id);
      if (!deletedEmployee) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy nhân viên để xóa" });
      }
      res.json({ message: "Xóa nhân viên thành công" });
    } catch (error) {
      console.error("Lỗi khi xóa nhân viên:", error);
      res.status(500).json({ message: "Không thể xóa nhân viên", error });
    }
  }
}

module.exports = EmployeeController;
