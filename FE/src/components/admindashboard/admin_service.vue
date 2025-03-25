<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      services: [],
      selectedStatus: "Tất cả", 
    statusOptions: ["Tất cả", "Đang mượn", "Yêu cầu mượn", "Đã trả"], 
    };
  },
  computed: {
     groupedServices() {
    return this.filteredServices.reduce((acc, service) => {
      if (!acc[service.hoTen]) {
        acc[service.hoTen] = [];
      }
      acc[service.hoTen].push(service);
      return acc;
    }, {});
  },
  filteredServices() {
    if (this.selectedStatus === "Tất cả") {
      return this.services; // Hiển thị tất cả
    }
    return this.services.filter(service => service.trangThai === this.selectedStatus);
  }
  },
  methods: {
    async fetchBorrowServices() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/borrow_service/"
        );
        this.services = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách mượn sách:", error);
      }
    },
    async approveBorrow(id) {
      try {
        await axios.put(
          `http://localhost:3000/api/borrow_service/approve/${id}`,
          {
            trangThai: "Đang mượn",
          }
        );
        this.fetchBorrowServices();
        Swal.fire({
          icon: "success",
          title: "Duyệt mượn sách thành công",
          text: "Trạng thái đã được cập nhật.",
        });
      } catch (error) {
        console.error("Lỗi khi duyệt mượn sách:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi xảy ra khi duyệt mượn sách.",
        });
      }
    },
    async returnBook(id) {
      try {
        await axios.put(
          `http://localhost:3000/api/borrow_service/returned/${id}`,
          {
            trangThai: "Đã trả",
          }
        );
        this.fetchBorrowServices();
        Swal.fire({
          icon: "success",
          title: "Trả sách thành công",
          text: "Trạng thái đã được cập nhật.",
        });
      } catch (error) {
        console.error("Lỗi khi trả sách:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi xảy ra khi trả sách.",
        });
      }
    },
    async deleteBorrow(id) {
      const result = await Swal.fire({
        title: "Bạn chắc chắn muốn xóa giao dịch này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        try {
          await axios.delete(
            `http://localhost:3000/api/borrow_service/deleteBorrow/${id}`
          );
          this.fetchBorrowServices();
          Swal.fire({
            icon: "success",
            title: "Xóa giao dịch thành công",
            text: "Giao dịch mượn sách đã bị xóa.",
          });
        } catch (error) {
          console.error("Lỗi khi xóa giao dịch mượn sách:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Có lỗi xảy ra khi xóa giao dịch.",
          });
        }
      }
    },
    formatDate(dateString) {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    },
  },
  mounted() {
    this.fetchBorrowServices();
  },
};
</script>



<template>
  <div class="admin-container">
  <h2>Quản lý Dịch vụ Mượn Sách</h2>

  <!-- Bộ lọc trạng thái -->
  <div class="filter-container">
    <label for="statusFilter">Lọc theo trạng thái:</label>
    <select v-model="selectedStatus" id="statusFilter">
      <option v-for="status in statusOptions" :key="status" :value="status">
        {{ status }}
      </option>
    </select>
  </div>

  <table>
    <thead>
      <tr>
        <th>Tên người mượn</th>
        <th>Tên Sách</th>
        <th>Trạng Thái</th>
        <th>Ngày Mượn</th>
        <th>Ngày Phải Trả</th>
        <th>Số Lượng</th>
        <th>Đơn giá</th>
        <th>Tiền Phạt</th>
        <th></th>
      </tr>
    </thead>

    <tbody v-for="(books, reader) in groupedServices" :key="reader">
      <tr>
        <td colspan="9" class="reader-name">
          <strong>{{ reader }}</strong>
        </td>
      </tr>
      <tr v-for="(service, index) in books" :key="service._id || index">
        <td></td>
        <td>{{ service.tenSach }}</td>
        <td>{{ service.trangThai }}</td>
        <td>{{ formatDate(service.ngayMuon) }}</td>
        <td>{{ formatDate(service.ngayPhaiTra) }}</td>
        <td>{{ service.soLuong }}</td>
        <td>{{ service.donGia }} vnd</td>
        <td>{{ service.tienPhat }} vnd</td>
        <td>
          <div class="button-group">
            <button
              v-if="service.trangThai === 'Yêu cầu mượn'"
              @click="approveBorrow(service._id)"
              class="approve-btn"
            >
              Duyệt
            </button>
            <button
              v-if="service.trangThai === 'Đang mượn'"
              @click="returnBook(service._id)"
              class="return-btn"
            >
              Trả Sách
            </button>
          </div>
          <button @click="deleteBorrow(service._id)" class="delete-btn">
            Xóa
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>

</template>


<style scoped>
.admin-container {
  padding: 20px;
  height: 1000px;
  max-height:auto;
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

.approve-btn,
.return-btn,
.delete-btn {
  padding: 5px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;
  width: 90px;
  display: inline-block;
}

.approve-btn {
  background-color: #28a745;
  color: white;
  border: none;
}

.approve-btn:hover {
  background-color: #218838;
}

.return-btn {
  background-color: #dc3545;
  color: white;
  border: none;
}

.return-btn:hover {
  background-color: #c82333;
}

.delete-btn {
  background-color: #ffc107;
  color: white;
  border: none;
}

.delete-btn:hover {
  background-color: #e0a800;
}

.button-group {
  display: flex;
  justify-content: center; /* Căn giữa các nút */
  width: 100px;
  align-items: center;
}
</style>
