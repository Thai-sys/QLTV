<template>
  <div class="register-container">
    <div class="register-content">
      <div class="register-image">
        <img src="/public/img/register-banner.jpg" alt="Register Banner" />
      </div>

      <div class="register-form-wrapper">
        <h2 class="text-center">Đăng Ký Thành Viên</h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="hoTen" class="form-label">Họ và Tên</label>
            <input
              type="text"
              class="form-control"
              id="hoTen"
              v-model="hoTen"
              placeholder="Nhập họ tên"
              required
            />
          </div>

          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="email"
              @input="checkEmail"
              placeholder="Nhập địa chỉ email"
              required
            />
            <div v-if="emailError" class="text-danger">{{ emailError }}</div>
          </div>

          <div class="mb-3">
            <label for="diaChi" class="form-label">Địa Chỉ</label>
            <input
              type="text"
              class="form-control"
              id="diaChi"
              v-model="diaChi"
              placeholder="Nhập địa chỉ"
              required
            />
          </div>

          <div class="mb-3">
            <label for="sdt" class="form-label">Số Điện Thoại</label>
            <input
              type="tel"
              class="form-control"
              id="sdt"
              v-model="sdt"
              placeholder="Nhập số điện thoại"
              required
            />
            <div v-if="phoneError" class="text-danger">{{ phoneError }}</div>
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Mật Khẩu</label>
            <input
              type="password"
              class="form-control"
              id="password"
              v-model="password"
              placeholder="Nhập mật khẩu"
              required
            />
            <div v-if="passwordLengthError" class="text-danger">
              {{ passwordLengthError }}
            </div>
          </div>

          <div class="mb-3">
            <label for="confirmPassword" class="form-label"
              >Xác Nhận Mật Khẩu</label
            >
            <input
              type="password"
              class="form-control"
              id="confirmPassword"
              v-model="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              required
            />
            <div v-if="passwordMismatch" class="text-danger">
              Mật khẩu không khớp!
            </div>
          </div>

          <div class="d-flex justify-content-center w-100 mt-3">
            <button type="submit" class="btn btn-register">Đăng Ký</button>
          </div>

          <div class="d-flex justify-content-center w-100 mt-3">
            <span>Đã có tài khoản?</span>
            <router-link class="btn-login mx-2" to="/userlogin">
              Đăng nhập
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      hoTen: "",
      email: "",
      diaChi: "",
      sdt: "",
      password: "",
      confirmPassword: "",
      emailError: "",
      phoneError: "",
      passwordMismatch: false,
      passwordLengthError: "",
      debounceTimer: null,
    };
  },
  watch: {
    password() {
      this.passwordMismatch = this.password !== this.confirmPassword;
      this.passwordLengthError =
        this.password.length < 4 ? "Mật khẩu phải có ít nhất 4 ký tự." : "";
    },
    confirmPassword() {
      this.passwordMismatch = this.password !== this.confirmPassword;
    },
    sdt() {
      this.phoneError =
        this.sdt.length < 10 ? "Số điện thoại phải có ít nhất 10 số." : "";
    },
  },
  methods: {
    async handleSubmit() {
      if (
        this.passwordMismatch ||
        this.emailError ||
        this.phoneError ||
        this.passwordLengthError
      )
        return;

      Swal.fire({
        title: "Đang xử lý...",
        text: "Vui lòng chờ giây lát",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const response = await axios.post(
          "http://localhost:3000/api/auth/register",
          {
            hoTen: this.hoTen,
            email: this.email,
            diaChi: this.diaChi,
            sdt: this.sdt,
            password: this.password,
          }
        );

        Swal.fire({
          icon: "success",
          title: "Đăng ký thành công!",
          text: "Bạn sẽ được chuyển đến trang đăng nhập.",
          timer: 3000,
          showConfirmButton: false,
        });
        setTimeout(() => {
          this.$router.push("/userlogin");
        }, 3000);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: error.response.data.error || "Có lỗi xảy ra khi đăng ký!",
        });
      }
    },
    checkEmail() {
      clearTimeout(this.debounceTimer);

      // In ra email khi bắt đầu kiểm tra,
      this.debounceTimer = setTimeout(async () => {
        console.log("Email sau khi nhập xong:", this.email);
        if (!this.email.trim()) {
          this.emailError = "Email không được để trống.";
          return;
        }

        try {
          const response = await axios.post(
            "http://localhost:3000/api/auth/check-email",
            { email: this.email.trim() }
          );

          this.emailError = response.data.exists ? "Email đã tồn tại." : "";
        } catch (error) {
          this.emailError = "Email đã tồn tại.";
        }
      }, 500);
    },
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70vw;
  height: 100vh;
  background-color: #dceefb;
}

.register-content {
  display: flex;
  background: white;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  max-width: 800px;
  width: 100%;
}

.register-image {
  width: 40%;
}

.register-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.register-form-wrapper {
  width: 60%;
  padding: 40px;
}

h2 {
  color: #007bff;
}

.form-label {
  color: #333;
}

.form-control {
  border-radius: 8px;
  border: 1px solid #ccc;
}

.btn-register {
  background-color: #007bff;
  color: white;
  border-radius: 8px;
  padding: 10px 20px;
}

.btn-login {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.btn-login:hover {
  text-decoration: underline;
}
</style>