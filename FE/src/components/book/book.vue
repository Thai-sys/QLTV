<script>
import axios from "axios";

export default {
  data() {
    return {
      books: [],
      filteredBooks: [],
      categories: [], // Lưu danh sách thể loại
      selectedCategory: "", // Thể loại đang được chọn
      searchQuery: "",
      loading: false,
      error: null,
      defaultImage: "https://via.placeholder.com/150?text=No+Image",
      visibleBooksCount: 4,
    };
  },
  created() {
    this.fetchBooks();
    this.fetchCategories(); // Gọi API lấy thể loại khi component khởi tạo
  },
  methods: {
    async fetchBooks() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get("http://localhost:3000/api/books/");
        this.books = response.data;
        this.filteredBooks = this.books;
      } catch (err) {
        this.error = "Không thể tải danh sách sách. Vui lòng thử lại!";
      } finally {
        this.loading = false;
      }
    },
    async fetchCategories() {
      try {
        const response = await axios.get("http://localhost:3000/api/category/");
        this.categories = response.data;
        console.log(this.categories);
      } catch (err) {
        console.error("Lỗi khi tải danh sách thể loại:", err);
      }
    },
    searchBook() {
      this.filterBooks();
    },
    filterBooks() {
      let query = this.searchQuery.trim().toLowerCase();
      this.filteredBooks = this.books.filter((book) => {
        let matchesSearch =
          !query || book.tenSach.toLowerCase().includes(query);
        let matchesCategory =
          !this.selectedCategory || book.theLoai === this.selectedCategory;
        console.log(book.theLoai);
        return matchesSearch && matchesCategory;
      });
      this.visibleBooksCount = 4;
    },
    selectCategory(category) {
      this.selectedCategory = category;

      this.filterBooks();
    },
    bookImage(url) {
      return url
        ? `http://localhost:3000/public/anh_sach/${url}`
        : this.defaultImage;
    },
    handleImageError(event) {
      event.target.src = this.defaultImage;
    },
    showMoreBooks() {
      this.visibleBooksCount += 4;
    },
    collapseBooks() {
      this.visibleBooksCount = 4;
    },
    saveBook(book) {
      sessionStorage.setItem("selectedBook", JSON.stringify(book));
    },
  },
};
</script>


<template>
  <div class="container py-4">
    <br /><br />

 <div class="search-container">
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
  <div class="search-box">
    <input
      type="text"
      v-model="searchQuery"
      @input="filterBooks"
      class="search-input"
      placeholder="Nhập tên sách..."
    />
  </div>

 
</div>


    <div v-if="loading" class="text-center">Đang tải...</div>
    <div v-if="error" class="text-danger text-center">{{ error }}</div>

    <div v-if="filteredBooks.length" class="row row-cols-1 row-cols-md-4 g-4">
      <div
        v-for="book in filteredBooks.slice(0, visibleBooksCount)"
        :key="book.id"
        class="col"
      >
        <hr />
        <div class="book-card">
          <div class="book-image">
            <img
              :src="bookImage(book.url)"
              :alt="book.tenSach"
              class="book-img"
              @error="handleImageError"
            />
            <div class="book-overlay">
              <h5 class="book-title">{{ book.tenSach }}</h5>
              <p class="book-author">Tác giả: {{ book.tacGia }}</p>
            </div>
          </div>
          <div class="btn-group">
            <router-link
              :to="{ path: `/details-book`, query: { id: book._id } }"
              @click="saveBook(book)"
            >
              <button class="btn btn-detail">Xem Chi Tiết</button>
            </router-link>

            <router-link
              v-if="book.soQuyen - book.count > 0"
              :to="'/service-book'"
              @click="saveBook(book)"
            >
              <button class="btn btn-rent">Mượn</button>
            </router-link>
            <span v-else>
              <button class="btn btn-rent" disabled>Hết hàng</button>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading && !filteredBooks.length" class="text-center">
      Không tìm thấy sách nào.
    </div>

    <div
      v-if="filteredBooks.length > visibleBooksCount"
      class="text-center mt-3"
    >
      <button class="btn btn-primary" @click="showMoreBooks">Xem thêm</button>
    </div>
    <div
      v-if="
        filteredBooks.length <= visibleBooksCount && filteredBooks.length > 4
      "
      class="text-center mt-3"
    >
      <button class="btn btn-danger" @click="collapseBooks">Thu gọn</button>
    </div>
  </div>
</template>


<style scoped>
.container {
  width: 1300px;
  min-height: 850px;
  max-height: 17000px;
  max-width: 1400px;
  margin: auto;
  background-color: rgb(192, 194, 255);
}
.book-card {
  width: 100%;
  text-align: center;
  overflow: hidden;
  background: rgb(205, 209, 204);
  padding-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.book-image {
  position: relative;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
}

.book-img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;
}

.book-overlay {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  text-align: center;
  transform: translateY(100%);
  transition: transform 0.3s ease-in-out;
}

.book-title {
  font-size: 18px;
  font-weight: bold;
}

.book-author,
.book-price {
  font-size: 14px;
}

.btn-group {
  display: flex;
  justify-content: center;
  gap: 10px;
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

.book-image:hover .book-overlay {
  transform: translateY(0);
}
.search-container {
  display: flex;
  align-items: center;
  gap: 15px;
  background: #ffffff;
  padding: 12px 15px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  margin: auto;
}

.filter-category {
  display: flex;
  flex-direction: column;
}



.form-select {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.form-select:hover,
.form-select:focus {
  border-color: #007bff;
  outline: none;
}

.search-box {
  flex-grow: 1;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  transition: border 0.3s ease;
  font-size: 14px;
}

.search-input:focus {
  border-color: #007bff;
}



</style>
