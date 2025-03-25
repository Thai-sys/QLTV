<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      books: [],
      filteredBooks: [],
      searchQuery: "",
      isEditModalOpen: false,
      categories: [], // Lưu danh sách thể loại
      selectedCategory: "", // Thể loại đang được chọn
      editedBook: {
        _id: "",
        title: "",
        author: "",
        genre: "",
        publishedDate: "",
        price: "",
      },
    };
  },
  mounted() {
    this.fetchBooks();
    this.fetchCategories(); // Gọi API lấy thể loại khi component khởi tạo
  },
  methods: {
    async fetchBooks() {
      try {
        const response = await axios.get("http://localhost:3000/api/books/");
        this.books = response.data;
        this.filteredBooks = this.books; // Cập nhật danh sách ban đầu
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sách:", error);
      }
    },
    async searchBook() {
      this.filterBooks();
    },
    async fetchCategories() {
      try {
        const response = await axios.get("http://localhost:3000/api/category/");
        this.categories = response.data;
      } catch (err) {
        console.error("Lỗi khi tải danh sách thể loại:", err);
      }
    },
    filterBooks() {
      let query = this.searchQuery.trim().toLowerCase();
      this.filteredBooks = this.books.filter((book) => {
        let matchesSearch =
          !query || book.tenSach.toLowerCase().includes(query);
        let matchesCategory =
          !this.selectedCategory || book.theLoai === this.selectedCategory;
        return matchesSearch && matchesCategory;
      });
    },
    async deleteBook(bookId) {
      try {
        const result = await Swal.fire({
          title: "Bạn có chắc chắn muốn xóa sách này?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
        });

        if (result.isConfirmed) {
          await axios.delete(
            `http://localhost:3000/api/books/deleteBook/${bookId}`
          );

          Swal.fire("Đã xóa!", "Sách đã bị xóa.", "success");
          this.fetchBooks();
        }
      } catch (error) {
        console.error("Lỗi khi xóa sách:", error);
        Swal.fire("Lỗi!", "Sách đang được mượn.", "error");
      }
    },
    openEditModal(book) {
      this.$emit("changeComponent", "EditBook", book);
    },
  },
};
</script>

<template>
  <div class="admin-page">
    <div class="admin-container">
      <h2>Quản lý Sách Trong Kho</h2>

      <!-- Bộ lọc thể loại -->
      <div class="filter-category">
        <select v-model="selectedCategory" @change="filterBooks" class="form-select">
          <option value="">Tất cả</option>
          <option v-for="category in categories" :key="category._id" :value="category.tenTheLoai">
            {{ category.tenTheLoai }}
          </option>
        </select>
      </div>

      <!-- Ô tìm kiếm -->
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Nhập tên sách..."
          @input="searchBook"
          autocomplete="new-password"
        />
      </div>
      <button @click="$emit('changeComponent', 'AddBook')">Thêm sách</button>

      <!-- Bảng danh sách sách -->
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>Nhà xuất bản</th>
              <th>Thể loại</th>
              <th>Ngày xuất bản</th>
              <th>Số lượng</th>
              <th>Đang mượn</th>
              <th>Giá</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in filteredBooks" :key="book._id">
              <td>{{ book.tenSach }}</td>
              <td>{{ book.tacGia }}</td>
              <td>{{ book.nhaxuatban }}</td>
              <td>{{ book.theLoai }}</td>
              <td>{{ book.namXuatBan }}</td>
              <td>{{ book.soQuyen }}</td>
              <td>{{ book.count }}</td>
              <td>{{ book.donGia }}</td>
              <td>
                <button class="edit-btn" @click="openEditModal(book)">Sửa</button>
                <button class="delete-btn" @click="deleteBook(book._id)">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
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
  width: 150px;
  background: #007bff;
  color: white;
  font-weight: bold;
}

td {
  width: 150px;
  background: #fff;
}

button {
  background: #28a745;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.3s ease-in-out, transform 0.2s;
}

.edit-btn {
  background: #ffc107;
  color: #333;
  border: none;
  padding: 8px 15px;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s, transform 0.2s;
}

.delete-btn {
  background: red;
  color: white;
  border: none;
  padding: 8px 15px;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s;
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

.save-btn,
.cancel-btn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease-in-out;
  flex: 1;
  text-align: center;
}

.save-btn {
  background: #28a745;
  color: white;
  margin-right: 5px;
}

.save-btn:hover {
  background: #218838;
}

.cancel-btn {
  background: #dc3545;
  color: white;
  margin-left: 5px;
}

.cancel-btn:hover {
  background: #c82333;
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
