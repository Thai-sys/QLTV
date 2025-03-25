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
          <p><strong>Tên khách hàng:</strong> {{ user.hoTen }}.</p>

          <h2 class="book-title">{{ book.tenSach }}.</h2>
          <p><strong>Tác giả:</strong> {{ book.tacGia }}.</p>
          <p><strong>Thể loại:</strong> {{ book.theLoai }}.</p>
          <p><strong>Số lượng:</strong> {{ book.soQuyen - book.count }}.</p>
          <p><strong>Nhà xuất bản:</strong> {{ book.nhaxuatban }}.</p>
          <p><strong>Đơn giá:</strong> {{ book.donGia }} VNĐ/quyển/tháng.</p>

          <!-- Form nhập thông tin khách hàng và số lượng -->
          <div v-if="book.soQuyen - book.count > 0" class="form-rent">
            <form @submit.prevent="confirmRent">
              <div class="form-group">
                <label for="quantity">Số lượng muốn thuê</label>
                <input
                  type="number"
                  id="quantity"
                  v-model="quantity"
                  :max="book.soQuyen - book.count"
                  min="1"
                  required
                />
              </div>

              <!-- Ngày thuê là hôm nay mặc định và ngày trả -->
              <div class="form-group">
                <label for="returnDate">Ngày trả</label>
                <input
                  type="date"
                  id="returnDate"
                  v-model="returnDate"
                  required
                  @change="validateReturnDate"
                />
              </div>
              <!-- Hiển thị tổng tiền phải trả -->
              <p v-if="totalAmount > 0">
                <strong>Số tiền phải trả:</strong> {{ totalAmount }} VNĐ
              </p>
              <button type="submit" class="btn btn-rent">Xác nhận thuê</button>
            </form>
            <!-- Hiển thị thông báo nếu ngày trả không hợp lệ -->
            <p v-if="isReturnDateInvalid" class="error-message">
              Ngày trả phải lớn hơn ngày hôm nay!
            </p>
          </div>
        </div>
      </div>
      <div v-else class="not-found">Không tìm thấy sách!</div>

      <!-- Nút quay lại -->
      <button class="back-button" @click="$router.go(-1)">← Quay lại</button>
    </div>
  </div>
</template>

<script>
import Header from "@/components/header/header.vue";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

export default {
  components: { Header },

  data() {
    return {
      book: null,
      defaultImage: "https://via.placeholder.com/200x300?text=No+Image",
      user: {
        name: "",
        email: "",
      },
      quantity: 1,
      returnDate: "",
      today: this.getTodayDate(),
      isReturnDateInvalid: false, // Biến để kiểm tra ngày trả
    };
  },

  computed: {
    totalAmount() {
      const rentalDays = this.calculateDaysBetweenDates(
        this.today,
        this.returnDate
      );
      return rentalDays > 0 && this.book.donGia > 0
        ? this.book.donGia * this.quantity * rentalDays
        : 0;
    },
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
    async getUserInfo() {
      const token = Cookies.get("accessToken");

      if (!token) {
        // Hiển thị thông báo lỗi và CHỜ đóng thông báo trước khi chuyển hướng
        await Swal.fire({
          icon: "error",
          title: "Bạn chưa đăng nhập",
          text: "Vui lòng đăng nhập để thực hiện dịch vụ",
        });

        // Chỉ chuyển hướng sau khi thông báo đã đóng
        this.$router.push("/userlogin");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log(data);
        if (response.ok) {
          this.user = data; // Lưu trực tiếp thông tin người dùng vào component
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: data.message,
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Lỗi khi tải thông tin người dùng.",
        });
      }
    },

    async confirmRent() {
      // Tính toán tổng số tiền cần trả
      const totalAmount = this.totalAmount;
      try {
        console.log(this.user._id);
        console.log(this.book._id);
        console.log(this.quantity);
        console.log(totalAmount);
        console.log(this.returnDate);

        const response = await axios.post(
          "http://localhost:3000/api/borrow_service/addnewservice",
          {
            docgia_id: this.user._id, 
            sach_id: this.book._id, 
            soLuong: this.quantity, 
            donGia: totalAmount, 
            ngayPhaiTra: this.returnDate, 
          }
        );
        console.log(response.data); 
        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Yêu cầu mượn sách của bạn đã được gửi thành công!",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: response.data.message || "Đã có lỗi xảy ra!",
          });
        }
      } catch (error) {
        console.error("Error sending borrow request:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Đã có lỗi xảy ra khi gửi yêu cầu mượn sách.",
        });
      }
    },

    getTodayDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, "0");
      const day = today.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    calculateDaysBetweenDates(startDate, endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeDifference = end - start;
      return timeDifference >= 0 ? timeDifference / (1000 * 3600 * 24) : 0;
    },

    bookImage(url) {
      return url
        ? `http://localhost:3000/public/anh_sach/${url}`
        : this.defaultImage;
    },
    handleImageError(event) {
      event.target.src = this.defaultImage;
    },

    // Kiểm tra ngày trả phải lớn hơn ngày hôm nay
    validateReturnDate() {
      const returnDate = new Date(this.returnDate);
      const today = new Date(this.today);
      this.isReturnDateInvalid = returnDate <= today;
    },
  },

  mounted() {
    this.getUserInfo();
  },
};
</script>




<style scoped>
.container {
  width: 1000px;
  max-width: 1200px;
  background: rgb(0, 130, 142);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-left: 10rem;

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

.form-rent {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #4a90e2;
}

.btn-rent {
  background: #d50101;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.btn-rent:hover {
  background: #890101;
}
</style>
