<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4 fw-bold text-primary">Quản lý Nhà Xuất Bản</h2>

    <!-- Form Thêm Nhà Xuất Bản -->
    <div class="add card shadow-sm p-4 mb-4">
      <h5 class="mb-3 text-success">Thêm Nhà Xuất Bản</h5>
      <div class="row g-3 align-items-end">
        <div class="col-md-4">
          <input
            v-model="newPublisher.tenNXB"
            type="text"
            class="form-control"
            placeholder="Tên NXB"
          />
        </div>
        <div class="col-md-4">
          <input
            v-model="newPublisher.diaChi"
            type="text"
            class="form-control"
            placeholder="Địa chỉ"
          />
        </div>
        <div class="col-md-3">
          <input
            v-model="newPublisher.sdt"
            type="text"
            class="form-control"
            placeholder="Số điện thoại"
          />
        </div>
        <div class="col-md-1 text-center">
          <button class="btn btn-success btn-lg" @click="addPublisher">
            Thêm
          </button>
        </div>
      </div>
    </div>

    <!-- Bảng danh sách -->
    <div class="table-responsive">
      <table class="table table-striped">
        <thead class="table-dark">
          <tr>
            <th>Tên Nhà Xuất Bản</th>
            <th>Địa Chỉ</th>
            <th>Số Điện Thoại</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="publisher in publishers" :key="publisher._id">
            <td>{{ publisher.tenNXB }}</td>
            <td>{{ publisher.diaChi }}</td>
            <td>{{ publisher.sdt }}</td>
            <td>
              <button
                class="btn btn-warning btn-sm"
                @click="openModal(publisher)"
              >
                ✏️ Sửa
              </button>
              <button
                class="btn btn-danger btn-sm"
                @click="deletePublisher(publisher._id)"
              >
                🗑️ Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal tự tạo -->
    <div v-if="showModal" class="custom-modal">
      <div class="modal-content">
        <h5>Chỉnh Sửa Nhà Xuất Bản</h5>
        <input
          v-model="editPublisher.tenNXB"
          type="text"
          class="form-control mb-3"
          placeholder="Tên Nhà Xuất Bản"
        />
        <input
          v-model="editPublisher.diaChi"
          type="text"
          class="form-control mb-3"
          placeholder="Địa chỉ"
        />
        <input
          v-model="editPublisher.sdt"
          type="text"
          class="form-control mb-3"
          placeholder="Số điện thoại"
        />
        <div class="modal-actions">
          <button class="btn btn-success" @click="updatePublisher">
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
      publishers: [],
      newPublisher: { tenNXB: "", diaChi: "", sdt: "" },
      editPublisher: { _id: "", tenNXB: "", diaChi: "", sdt: "" },
      showModal: false,
    };
  },
  mounted() {
    this.fetchPublishers();
  },
  methods: {
    async fetchPublishers() {
      const response = await axios.get("http://localhost:3000/api/publisher/");
      this.publishers = response.data;
    },
    openModal(publisher) {
      this.editPublisher = { ...publisher };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async addPublisher() {
      try {
        await axios.post(
          "http://localhost:3000/api/publisher/",
          this.newPublisher
        );
        this.fetchPublishers();
        Swal.fire("Thành công", "Thêm nhà xuất bản thành công!", "success");
        this.newPublisher = { tenNXB: "", diaChi: "", sdt: "" };
      } catch (error) {
        Swal.fire("Lỗi", "Không thể thêm nhà xuất bản!", "error");
      }
    },
    async updatePublisher() {
      await axios.put(
        `http://localhost:3000/api/publisher/${this.editPublisher._id}`,
        this.editPublisher
      );
      this.fetchPublishers();
      this.closeModal();
    },
    async updatePublisher() {
      if (
        !this.editPublisher.tenNXB ||
        !this.editPublisher.diaChi ||
        !this.editPublisher.sdt
      ) {
        Swal.fire("Lỗi", "Vui lòng nhập đầy đủ thông tin!", "warning");
        return;
      }

      try {
        const response = await axios.put(
          `http://localhost:3000/api/publisher/${this.editPublisher._id}`,
          this.editPublisher
        );

        if (response.status === 200 || response.data) {
          Swal.fire("Thành công", "Nhà xuất bản đã được cập nhật!", "success");
          this.fetchPublishers();
          this.closeModal();
        } else {
          Swal.fire("Lỗi", "Không thể cập nhật nhà xuất bản!", "error");
        }
      } catch (error) {
        Swal.fire("Lỗi", "Có lỗi xảy ra khi cập nhật nhà xuất bản!", "error");
      }
    },
    async deletePublisher(publisherId) {
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
              `http://localhost:3000/api/publisher/${publisherId}`
            );
            Swal.fire("Đã xóa!", "Nhà xuất bản đã bị xóa.", "success");
            this.fetchPublishers();
          } catch (error) {
            Swal.fire("Lỗi", "Không thể xóa nhà xuất bản!", "error");
          }
        }
      });
    },
  },
};
</script>

<style>
.add{
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
