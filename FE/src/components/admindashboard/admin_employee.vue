<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4 fw-bold text-primary">Quản lý Nhân Viên</h2>

    <div class="add card shadow-sm p-4 mb-4">
  <div class="mb-3 text-success">Thêm Nhân Viên</div>
  <div class="row g-3">
    <div class="col-md-6">
      <input v-model="newEmployee.hoTen" type="text" class="form-control" placeholder="Họ tên" />
    </div>
    <div class="col-md-6">
      <input v-model="newEmployee.diaChi" type="text" class="form-control" placeholder="Địa chỉ" />
    </div>
    <div class="col-md-6">
      <input v-model="newEmployee.sdt" type="text" class="form-control" placeholder="Số điện thoại" />
    </div>
    <div class="col-md-6">
      <input v-model="newEmployee.email" type="email" class="form-control" placeholder="Email" />
    </div>
    <div class="col-md-6">
      <input v-model="newEmployee.password" type="password" class="form-control" placeholder="Mật khẩu" />
    </div>
    <div class="col-md-6 text-center">
      <button class="btn btn-success btn-sm w-auto" @click="addEmployee">Thêm</button>
    </div>
  </div>
</div>


    <div class="table-responsive">
      <table class="table table-striped">
        <thead class="table-dark">
          <tr>
            <th>Họ Tên</th>
            <th>Địa Chỉ</th>
            <th>Số Điện Thoại</th>
            <th>Email</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in employees" :key="employee._id">
            <td>{{ employee.hoTen }}</td>
            <td>{{ employee.diaChi }}</td>
            <td>{{ employee.sdt }}</td>
            <td>{{ employee.email }}</td>
            <td>
              <button
                class="btn btn-warning btn-sm"
                @click="openModal(employee)"
              >
                ✏️ Sửa
              </button>
              <button
                class="btn btn-danger btn-sm"
                @click="deleteEmployee(employee._id)"
              >
                🗑️ Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="custom-modal">
      <div class="modal-content">
        <h5>Chỉnh Sửa Nhân Viên</h5>
        <input
          v-model="editEmployee.hoTen"
          type="text"
          class="form-control mb-3"
          placeholder="Họ tên"
        />
        <input
          v-model="editEmployee.diaChi"
          type="text"
          class="form-control mb-3"
          placeholder="Địa chỉ"
        />
        <input
          v-model="editEmployee.sdt"
          type="text"
          class="form-control mb-3"
          placeholder="Số điện thoại"
        />
        <input
          v-model="editEmployee.email"
          type="email"
          class="form-control mb-3"
          placeholder="Email"
        />
        <div class="modal-actions">
          <button class="btn btn-success" @click="updateEmployee">
            Cập Nhật
          </button>
          <button class="btn btn-secondary" @click="closeModal">Hủy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";
export default {
  data() {
    return {
      employees: [],
      newEmployee: { hoTen: "", diaChi: "", sdt: "", email: "", password: "" }, // Thêm password
      editEmployee: { _id: "", hoTen: "", diaChi: "", sdt: "", email: "" },
      showModal: false,
    };
  },
  mounted() {
    this.fetchEmployees();
  },
  methods: {
    async fetchEmployees() {
      const response = await axios.get("http://localhost:3000/api/employee/");
      this.employees = response.data;
    },
    openModal(employee) {
      this.editEmployee = { ...employee };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async addEmployee() {
      try {
        await axios.post(
          "http://localhost:3000/api/employee/",
          this.newEmployee
        );
        this.fetchEmployees();
        Swal.fire("Thành công", "Thêm nhân viên thành công!", "success");
        this.newEmployee = { hoTen: "", diaChi: "", sdt: "", email: "" };
      } catch (error) {
        Swal.fire("Lỗi", "Không thể thêm nhân viên!", "error");
      }
    },
    async updateEmployee() {
      if (
        !this.editEmployee.hoTen ||
        !this.editEmployee.diaChi ||
        !this.editEmployee.sdt ||
        !this.editEmployee.email
      ) {
        Swal.fire("Lỗi", "Vui lòng nhập đầy đủ thông tin!", "warning");
        return;
      }
      try {
        const response = await axios.put(
          `http://localhost:3000/api/employee/${this.editEmployee._id}`,
          this.editEmployee
        );
        if (response.status === 200 || response.data) {
          Swal.fire("Thành công", "Nhân viên đã được cập nhật!", "success");
          this.fetchEmployees();
          this.closeModal();
        } else {
          Swal.fire("Lỗi", "Không thể cập nhật nhân viên!", "error");
        }
      } catch (error) {
        Swal.fire("Lỗi", "Có lỗi xảy ra khi cập nhật nhân viên!", "error");
      }
    },
    async deleteEmployee(employeeId) {
      Swal.fire({
        title: "Bạn có chắc chắn?",
        text: "Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.delete(
              `http://localhost:3000/api/employee/${employeeId}`
            );
            Swal.fire("Đã xóa!", "Nhân viên đã bị xóa.", "success");
            this.fetchEmployees();
          } catch (error) {
            Swal.fire("Lỗi", "Không thể xóa nhân viên!", "error");
          }
        }
      });
    },
  },
};
</script>
<style>
.add {
  width: 1100px;
}
table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  table-layout: fixed;
}

th,
td {
  padding: 15px;
  border: 1px solid #ddd;
  text-align: left;
  word-wrap: break-word;
}

th {
  width: 150px;
  background: #007bff;
  color: white;
  font-weight: bold;
}

td {
  width: 150px;
  background: #fff;
}
.custom-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  text-align: center;
}
.modal-actions {
  display: flex;
  justify-content: space-between;
}
</style>
