<script>
import Header from "@/components/header/header.vue";

export default {
  components: { Header },

  data() {
    return {
      book: null,
      defaultImage: "https://via.placeholder.com/200x300?text=No+Image",
    };
  },
  created() {
    const storedBook = sessionStorage.getItem("selectedBook");
    if (storedBook) {
      this.book = JSON.parse(storedBook); // Lấy dữ liệu từ sessionStorage
    } else {
      this.$router.push("/"); // Chuyển hướng nếu không có dữ liệu
    }
  },
  methods: {
    bookImage(url) {
      return url
        ? `http://localhost:3000/public/anh_sach/${url}`
        : this.defaultImage;
    },
    handleImageError(event) {
      event.target.src = this.defaultImage;
    },
  },
};
</script>

<template>
  <div>
    <Header />
    <div class="container">
      <div v-if="book" class="book-card">
        <!-- Hiển thị ảnh sách -->
        <img
          :src="bookImage(book.url)"
          :alt="book.tenSach"
          class="book-img"
          @error="handleImageError"
        />
        <div class="book-info">
          <h2 class="book-title">{{ book.tenSach }}.</h2>
          <p><strong>Tác giả:</strong> {{ book.tacGia }}.</p>
          <p><strong>Thể loại:</strong> {{ book.theLoai }}.</p>
          <p><strong>Số lượng:</strong> {{ book.soQuyen - book.count }}.</p>
          <p><strong>Nhà xuất bản:</strong> {{ book.nhaxuatban }}.</p>
          <p><strong>Năm xuất bản:</strong> {{ book.namXuatBan }}.</p>
          <p><strong>Đơn giá:</strong> {{ book.donGia }} vnd.</p>

          <p>
            <strong>Trạng thái:</strong>
            <span
              :class="
                book.soQuyen - book.count > 0 ? 'in-stock' : 'out-of-stock'
              "
            >
              {{ book.soQuyen - book.count > 0 ? " Có thể mượn" : " Tạm hết" }}
            </span>
          </p>
          <div class="btn-group" v-if="book.soQuyen - book.count > 0">
            <router-link :to="{ path: `/service-book`, query: book }">
              <button class="btn btn-rent">Thuê Ngay</button>
            </router-link>
          </div>
        </div>
      </div>
      <div v-else class="not-found">Không tìm thấy sách!</div>

      <!-- Nút quay lại -->
      <button class="back-button" @click="$router.go(-1)">← Quay lại</button>
    </div>
  </div>
</template>


<style scoped>
.container {
  width: 1000px;
  max-width: 1200px;
  background: rgb(0, 130, 142);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-left: 10rem;
  margin-bottom: 10rem;
}

.book-card {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 20px;
  background: #f9f9ff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.book-img {
  width: 220px;
  height: 320px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.book-info {
  flex: 1;
  max-width: 600px;
}

.book-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

p {
  font-size: 16px;
  color: #555;
}

.not-found {
  text-align: center;
  color: red;
  font-size: 18px;
  font-weight: bold;
}

.back-button {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background: #4a90e2;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.3s ease;
}

.back-button:hover {
  background: #357bd8;
}
.in-stock {
  color: green;
  font-weight: bold;
}

.out-of-stock {
  color: red;
  font-weight: bold;
}

.btn-group {
  margin-top: 10px;
}

.btn {
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 5px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-detail {
  background: #484747;
  color: white;
  border: none;
}

.btn-detail:hover {
  background: #0b2135;
}

.btn-rent {
  background: #d50101;
  color: white;
  border: none;
}

.btn-rent:hover {
  background: #890101;
}
</style>
