<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      users: [],
      searchQuery: "",
      isEditModalOpen: false,
      editedUser: {
        _id: "",
        hoTen: "",
        email: "",
        sdt: "",
        diaChi: "",
        ngaySinh: "",
      },
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/user/users"
        );
        this.users = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
      }
    },
    async searchUser() {
      if (!this.searchQuery) {
        this.fetchUsers();
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:3000/api/user/search?email=${this.searchQuery}`
        );
        this.users = response.data;
      } catch (error) {
        console.error("Lỗi khi tìm kiếm người dùng:", error);
      }
    },
    async deleteUser(userId) {
      try {
        const result = await Swal.fire({
          title: "Bạn có chắc chắn muốn xóa người dùng này?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
        });

        if (result.isConfirmed) {
          await axios.delete(
            `http://localhost:3000/api/user/deleteUser/${userId}`
          );

          Swal.fire("Đã xóa!", "Người dùng đã bị xóa.", "success");
          this.fetchUsers(); // Cập nhật lại danh sách người dùng
        }
      } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
        Swal.fire("Lỗi!", "Người dùng còn dịch mượn sách.", "error");
      }
    },
    openEditModal(user) {
      this.editedUser = { ...user };
      this.isEditModalOpen = true;
    },
    async updateUser() {
      try {
        await axios.put(
          `http://localhost:3000/api/user/updateUser/${this.editedUser._id}`,
          this.editedUser
        );
        this.isEditModalOpen = false;
        this.fetchUsers();

        Swal.fire("Thành công!", "Người dùng đã được cập nhật.", "success");
      } catch (error) {
        console.error("Lỗi khi cập nhật người dùng:", error);
        Swal.fire("Lỗi!", "Có lỗi xảy ra khi cập nhật người dùng.", "error");
      }
    },
  },
};
</script>

<template>
  <div class="admin-page">
    <div class="admin-container">
      <h2>Quản lý Danh Sách Độc Giả</h2>

      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Nhập email người dùng..."
          @input="searchUser"
          autocomplete="new-password"
        />
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Độc giả</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ</th>
              <th>Ngày sinh</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user._id">
              <td>{{ user.hoTen }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.sdt }}</td>
              <td>{{ user.diaChi }}</td>
              <td>{{ user.ngaySinh }}</td>
              <td>
                <button class="edit-btn" @click="openEditModal(user)">
                  Sửa
                </button>
                <button class="delete-btn" @click="deleteUser(user._id)">
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal chỉnh sửa -->
      <div v-if="isEditModalOpen" class="modal">
        <div class="modal-content">
          <h3>Chỉnh sửa người dùng</h3>
          <input
            v-model="editedUser.hoTen"
            type="text"
            placeholder="Họ và Tên"
          />
          <input v-model="editedUser.email" type="email" placeholder="Email" />
          <input
            v-model="editedUser.sdt"
            type="text"
            placeholder="Số điện thoại"
          />
          <input
            v-model="editedUser.diaChi"
            type="text"
            placeholder="Địa chỉ"
          />
          <input v-model="editedUser.ngaySinh" type="date" />

          <div class="modal-actions">
            <button class="save-btn" @click="updateUser">Lưu</button>
            <button class="cancel-btn" @click="isEditModalOpen = false">
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
.admin-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20px;
}

.admin-container {
  top: 30px;
  left: 50%;
height: 1000px;
  max-height:auto;
  width: 100%;
  max-width: none;
  min-width: none;
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.search-container {
  margin-bottom: 20px;
}

input {
  padding: 12px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
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
  width: 230px;
  background: #007bff;
  color: white;
  font-weight: bold;
}

td {
  width: 230px;
  background: #fff;
}

.edit-btn {
  background: #ffc107;
  color: black;
  border: none;
  padding: 8px 15px;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  font-weight: bold;
}
.delete-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 15px;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  font-weight: bold;
}

.delete-btn:hover {
  background: #c82333;
  transform: scale(1.05);
}

.save-btn {
  background: #28a745;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease-in-out;
  font-weight: bold;
  flex: 1;
}

.cancel-btn {
  background: #6c757d;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease-in-out;
  font-weight: bold;
  flex: 1;
}

.edit-btn,
.delete-btn {
  margin-right: 5px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease-in-out;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 380px;
  max-width: 90%;
  animation: slideIn 0.3s ease-in-out;
}

.modal-content h3 {
  text-align: center;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
.modal-content input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border 0.2s ease-in-out;
}

.modal-content input:focus {
  border-color: #007bff;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
