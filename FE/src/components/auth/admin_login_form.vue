<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-image">
        <img src="/public/img/admin-login-banner.jpg" alt="Login Banner" />
      </div>

      <!-- Form đăng nhập -->

      <div class="login-form-wrapper">
        <h2 class="text-center">Đăng Nhập Nhân Viên</h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="email"
              placeholder="Nhập email"
              required
            />
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
          </div>

          <div class="d-flex justify-content-center w-100 mt-3">
            <button type="submit" class="btn btn-login">Đăng Nhập</button>
          </div>
          <div class="d-flex justify-content-center w-100 mt-3">
            <span>Bạn chưa có tài khoản?</span>
            <router-link class="btn-register mx-2" to="/register">
              Đăng ký ngay
            </router-link>
          </div>
        </form>
        <div v-if="isLoggedIn" class="alert alert-warning text-center">
          Bạn đã đăng nhập, vui lòng đăng xuất để đăng nhập tài khoản khác.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      email: "",
      password: "",
      isLoggedIn: false,
    };
  },

  methods: {
    async handleSubmit() {
      if (this.isLoggedIn) {
        Swal.fire({
          icon: "warning",
          title: "Bạn đã đăng nhập",
          text: "Vui lòng đăng xuất trước khi đăng nhập tài khoản khác.",
        });
        return;
      }
      try {
        const response = await axios.post(
          "http://localhost:3000/api/auth/adminlogin",
          {
            email: this.email,
            password: this.password,
          },
          { withCredentials: true }
        );
        
        if (response.data && response.data.user.role === "admin") {
          localStorage.setItem("adminRole", JSON.stringify(response.data.user));
        }
        Swal.fire({
          icon: "success",
          title: "Đăng nhập thành công!",
          text: "Chào mừng bạn quay trở lại!",
          timer: 2000,
          showConfirmButton: false,
        });

        this.$router.push("/admindashboard");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi đăng nhập",
          text:
            error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!",
        });
      }
    },
  },
  created() {
    if (Cookies.get("accessToken")) {
      this.isLoggedIn = true;
    }
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70vw;
  height: 100vh;
  background-color: #dceefb;
}

.login-content {
  display: flex;
  background: white;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  max-width: 800px;
  width: 100%;
}

.login-image {
  width: 40%;
}

.login-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.login-form-wrapper {
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

.btn-login {
  background-color: #007bff;
  color: white;
  border-radius: 8px;
  padding: 10px 20px;
}

.btn-register {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.btn-register:hover {
  text-decoration: underline;
}
</style>
