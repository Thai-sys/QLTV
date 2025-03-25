<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4 mt-2 text-primary">📚 Danh Sách Sách Đã Mượn</h2>
    <Header />

    <div class="table-container">
      <table class="table table-hover">
        <thead class="table-dark">
          <tr>
            <th class="text-center"></th>
            <th class="text-center">Tên Sách</th>
            <th class="text-center">Ngày Mượn</th>
            <th class="text-center">Ngày Phải Trả</th>
            <th class="text-center">Số lượng</th>
            <th class="text-center">Tiền phạt</th>
            <th class="text-center">Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(book, index) in borrowedBooks" :key="book._id">
            <td class="text-center">{{ index + 1 }}</td>
            <td>{{ book.tenSach }}</td>
            <td class="text-center">{{ formatDate(book.ngayMuon) }}</td>
            <td class="text-center">{{ formatDate(book.ngayPhaiTra) }}</td>
            <td class="text-center">{{ book.soLuong }}</td>
            <td class="text-center">{{ book.tienPhat }}</td>
            <td class="text-center">
              <span :class="statusClass(book.trangThai)">
                {{ book.trangThai }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="borrowedBooks.length === 0" class="text-center text-muted">
      Không có sách nào được mượn.
    </p>
  </div>
</template>


<script>
import axios from "axios";
import Header from "@/components/header/header.vue";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

export default {
  components: { Header },
  data() {
    return {
      borrowedBooks: [],
      user: {
        _id: "",
        hoTen: "",
        email: "",
      },
    };
  },
  methods: {
    async fetchBorrowedBooks() {
      const token = Cookies.get("accessToken");

      if (!token) {
        await Swal.fire({
          icon: "error",
          title: "Bạn chưa đăng nhập",
          text: "Vui lòng đăng nhập để xem danh sách sách đã mượn.",
        });
        this.$router.push("/userlogin");
        return;
      }

      try {
        const userResponse = await axios.get(
          "http://localhost:3000/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (userResponse.status === 200) {
          this.user = userResponse.data;
        }

        const booksResponse = await axios.get(
          `http://localhost:3000/api/borrow_service/borrowed-books/${this.user._id}`
        );

        if (booksResponse.status === 200) {
          this.borrowedBooks = booksResponse.data;
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể tải danh sách sách đã mượn.",
        });
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return "N/A";
      return new Date(dateStr).toLocaleDateString("vi-VN");
    },
    statusClass(status) {
      return {
        "badge bg-success": status === "Đã trả",
        "badge bg-warning text-dark": status === "Đang mượn",
        "badge bg-primary": status === "Yêu cầu mượn",
      };
    },
  },
  mounted() {
    this.fetchBorrowedBooks();
  },
};
</script>

<style scoped>
.container {
  margin-bottom: 13rem;
  margin-left: 5rem;
  height:700px ;
}
.table-container {
  width: 1000px;
  display: flex;
  justify-content: center;
}

.table {
  width: 100%;
  margin: 0 auto;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}


.badge {
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 8px;
}


</style>
