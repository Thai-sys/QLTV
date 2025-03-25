<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      newBook: {
        tenSach: "",
        namXuatBan: "",
        soQuyen: "",
        tacGia: "",
        donGia: "",
        theLoai_id: "",
        nxb_id: "",
        url: "",
      },
      danhSachTheLoai: [],
      danhSachNXB: [],
      fileAnh: null,
    };
  },
  methods: {
    async fetchDanhSachTheLoai() {
      try {
        const response = await axios.get("http://localhost:3000/api/category/");
        this.danhSachTheLoai = response.data;
      } catch (error) {
        console.error("Lỗi khi tải danh sách thể loại:", error);
      }
    },
    async fetchDanhSachNXB() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/publisher/"
        );
        this.danhSachNXB = response.data;
      } catch (error) {
        console.error("Lỗi khi tải danh sách NXB:", error);
      }
    },
    handleFileUpload(event) {
      this.fileAnh = event.target.files[0];
    },
    async addBook() {
      try {
        let formData = new FormData();
        formData.append("tenSach", this.newBook.tenSach);
        formData.append("namXuatBan", this.newBook.namXuatBan);
        formData.append("tacGia", this.newBook.tacGia);
        formData.append("soQuyen", this.newBook.soQuyen);
        formData.append("donGia", this.newBook.donGia);
        formData.append("theLoai_id", this.newBook.theLoai_id);
        formData.append("nxb_id", this.newBook.nxb_id);
        formData.append("url", this.fileAnh); // Gửi file ảnh lên backend
        console.log("Dữ liệu gửi đi:", Object.fromEntries(formData.entries()));

        const response = await axios.post(
          "http://localhost:3000/api/books/addBook",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        Swal.fire("Thành công!", "Sách đã được thêm vào.", "success");

        // Reset form
        this.newBook = {
          tenSach: "",
          namXuatBan: "",
          soQuyen: "",
          donGia: "",
          theLoai_id: "",
          nxb_id: "",
        };
        this.fileAnh = null;
        document.getElementById("url").value = "";

        // Quay lại trang danh sách sách
        this.$emit("changeComponent", "Book");
      } catch (error) {
        console.error("Lỗi khi thêm sách:", error);
        Swal.fire("Lỗi!", "Không thể thêm sách.", "error");
      }
    },

    goBack() {
      this.$emit("changeComponent", "Book"); // Quay về component trước đó (Book)
    },
  },
  mounted() {
    this.fetchDanhSachTheLoai();
    this.fetchDanhSachNXB();
  },
};
</script>
<template>
  <div class="add-book-container">
   
    <button type="button" class="back-btn" @click="goBack">
      ⬅ Quay lại
    </button>

    <h2 class="title">Thêm sách mới</h2>

    <form @submit.prevent="addBook" enctype="multipart/form-data" class="form">
      <div class="form-grid">
        <div class="form-group">
          <label for="tenSach">Tên sách:</label>
          <input type="text" id="tenSach" v-model="newBook.tenSach" required />
        </div>
        <div class="form-group">
          <label for="tacGia">Tác giả:</label>
          <input type="text" id="tacGia" v-model="newBook.tacGia" required />
        </div>
        <div class="form-group">
          <label for="namXuatBan">Năm xuất bản:</label>
          <input type="number" id="namXuatBan" v-model="newBook.namXuatBan" required />
        </div>
        <div class="form-group">
          <label for="soQuyen">Số quyển:</label>
          <input type="number" id="soQuyen" v-model="newBook.soQuyen" required />
        </div>
        <div class="form-group">
          <label for="donGia">Đơn giá:</label>
          <input type="number" id="donGia" v-model="newBook.donGia" required />
        </div>
        <div class="form-group">
          <label for="theLoai_id">Thể loại:</label>
          <select id="theLoai_id" v-model="newBook.theLoai_id" required>
            <option v-for="theLoai in danhSachTheLoai" :key="theLoai._id" :value="theLoai._id">
              {{ theLoai.tenTheLoai }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="nxb_id">Nhà xuất bản:</label>
          <select id="nxb_id" v-model="newBook.nxb_id" required>
            <option v-for="nxb in danhSachNXB" :key="nxb._id" :value="nxb._id">
              {{ nxb.tenNXB }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="url">Ảnh bìa:</label>
          <input type="file" id="url" @change="handleFileUpload" accept="image/*" required />
        </div>
      </div>
      <div class="button-group">
        <button type="submit" class="add-btn">Thêm sách</button>
        <button type="button" class="cancel-btn" @click="$emit('changeComponent', 'Book')">
          Hủy
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.add-book-container {
  position: relative;
  padding: 20px;
  max-width: 700px;
  margin: auto;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}


.back-btn {
  position: absolute;
bottom: -50px;
  left: 10px;
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

/* Form chung */
.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Chia form thành 2 cột */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

/* Các nhóm input */
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
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
}

/* Nhóm nút */
.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.add-btn {
  background: #2ecc71;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: 0.3s;
}

.add-btn:hover {
  background: #27ae60;
}

.cancel-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: 0.3s;
}

.cancel-btn:hover {
  background: #c0392b;
}
</style>
