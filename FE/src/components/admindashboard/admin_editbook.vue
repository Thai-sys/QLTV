<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  props: ["book"],
  data() {
    return {
      editedBook: { ...this.book },

      danhSachTheLoai: [],
      danhSachNXB: [],
    };
  },
  mounted() {
    this.fetchCategories().then(() => {

      const theLoai = this.danhSachTheLoai.find(
        (tl) => tl._id === this.book.theLoai_id
      );
      if (theLoai) {
        this.editedBook.theLoai_id = theLoai._id;
      }
    });

    this.fetchPublishers().then(() => {
      const nxb = this.danhSachNXB.find((n) => n._id === this.book.nxb_id);
      if (nxb) {
        this.editedBook.nxb_id = nxb._id;
      }
    });
  },
  methods: {
    async fetchCategories() {
  try {
    const response = await axios.get("http://localhost:3000/api/category/");
    this.danhSachTheLoai = response.data;
    if (this.book.theLoai_id) {
      const theLoai = this.danhSachTheLoai.find(
        (tl) => tl._id === this.book.theLoai_id
      );
      if (theLoai) {
        this.editedBook.theLoai_id = theLoai._id;
      }
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thể loại:", error);
  }
}
,
    async fetchPublishers() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/publisher/"
        );
        this.danhSachNXB = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy nhà xuất bản:", error);
      }
    },
    async updateBook() {
      try {
        const formData = new FormData();
        formData.append("tenSach", this.editedBook.tenSach);
        formData.append("tacGia", this.editedBook.tacGia);
        formData.append("namXuatBan", this.editedBook.namXuatBan);
        formData.append("soQuyen", Number(this.editedBook.soQuyen));
        formData.append("donGia", Number(this.editedBook.donGia));

        formData.append("theLoai_id", this.editedBook.theLoai_id);
        formData.append("nxb_id", this.editedBook.nxb_id);
      
     
        if (this.editedBook.file) {
          formData.append("url", this.editedBook.file);
        }

        await axios.put(
          `http://localhost:3000/api/books/updateBook/${this.editedBook._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        this.$emit("bookUpdated");
        Swal.fire("Thành công!", "Sách đã được cập nhật.", "success");
      } catch (error) {
        console.error("Lỗi khi cập nhật sách:", error);
        Swal.fire("Lỗi!", "Có lỗi xảy ra khi cập nhật sách.", "error");
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.editedBook.file = file;
    },

    goBack() {
      this.$emit("changeComponent", "Book"); 
    },
  },
};
</script>
<template>
  <div class="edit-book-container">
    <button type="button" class="back-btn" @click="goBack">⬅ Quay lại</button>
    <h2 class="title">Hiệu chỉnh đầu sách</h2>

    <form
      @submit.prevent="updateBook"
      enctype="multipart/form-data"
      class="form"
    >
      <div class="form-grid">
        <div class="form-group">
          <label for="tenSach">Tên sách:</label>
          <input
            type="text"
            id="tenSach"
            v-model="editedBook.tenSach"
            required
          />
        </div>
        <div class="form-group">
          <label for="tacGia">Tác giả:</label>
          <input type="text" id="tacGia" v-model="editedBook.tacGia" required />
        </div>
        <div class="form-group">
          <label for="namXuatBan">Năm xuất bản:</label>
          <input
            type="number"
            id="namXuatBan"
            v-model="editedBook.namXuatBan"
            required
          />
        </div>
        <div class="form-group">
          <label for="soQuyen">Số quyển:</label>
          <input
            type="number"
            id="soQuyen"
            v-model="editedBook.soQuyen"
            required
          />
        </div>
        <div class="form-group">
          <label for="donGia">Đơn giá:</label>
          <input
            type="number"
            id="donGia"
            v-model="editedBook.donGia"
            required
          />
        </div>
        <div class="form-group">
          <label for="theLoai_id">Thể loại:</label>
          <select id="theLoai_id" v-model="editedBook.theLoai_id" required>
            <option
              v-for="theLoai in danhSachTheLoai"
              :key="theLoai._id"
              :value="theLoai._id"
            >
              {{ theLoai.tenTheLoai }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="nxb_id">Nhà xuất bản:</label>
          <select id="nxb_id" v-model="editedBook.nxb_id" required>
            <option v-for="nxb in danhSachNXB" :key="nxb._id" :value="nxb._id">
              {{ nxb.tenNXB }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="url">Ảnh bìa:</label>
          <input
            type="file"
            id="url"
            @change="handleFileUpload"
            accept="image/*"
          />
        </div>
      </div>

      <div class="button-group">
        <button type="submit" class="save-btn">Lưu thay đổi</button>
        <button
          type="button"
          class="cancel-btn"
          @click="$emit('changeComponent', 'Book')"
        >
          Hủy
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.edit-book-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 22px;
  color: #333;
}

.form {
  display: flex;
  flex-direction: column;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.save-btn {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #dc3545;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.save-btn:hover {
  background-color: #0056b3;
}

.cancel-btn:hover {
  background-color: #c82333;
}
.back-btn {
  position: absolute;
  bottom: 190px;
  left: 240px;
  background: #3498db;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.3s;
}

.back-btn:hover {
  background: #2980b9;
}
</style>
