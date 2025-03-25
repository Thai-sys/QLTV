<template>
  <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
    <div class="container d-flex justify-content-between align-items-center">
      <!-- Logo -->
      <router-link
        to="/"
        class="navbar-brand fw-bold fs-4 d-flex align-items-center"
      >
        <img src="/public/img/logo.jpg" alt="Logo" class="logo me-2" />
        <span class="brand-text">Book</span>
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="d-flex align-items-center">
        <!-- Danh sách menu -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link
                to="/"
                class="nav-link"
                :class="{ active: $route.path === '/' }"
              >
                Trang chủ
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/book-service-list" class="nav-link">
                Dịch vụ sử dụng
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Đăng nhập / User -->
        <div class="ms-auto position-relative">
          <div v-if="isLoading">
            <span class="text-white">Đang tải...</span>
          </div>

          <div v-else-if="isLoggedIn" class="d-flex align-items-center">
            <div class="user-icon" @click="toggleDropdown">
              <i class="fa-solid fa-user text-white fs-4"></i>
            </div>
            <span class="text-white me-2"
              >Xin chào, <b>{{ user.hoTen }}</b></span
            >
            <button @click="handleLogout" class="logout">Đăng xuất</button>
          </div>

          <div v-else class="btn fw-bold" style="text-decoration: none">
            <router-link class="text-dark" to="/userlogin"
              >Đăng nhập</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>


<script>
import Cookies from "js-cookie";
import axios from "axios";
export default {
  name: "Header",
  data() {
    return {
      isLoggedIn: false,
      isLoading: true,
      isDropdownOpen: false,
      user: {
        hoTen: "",
      },
    };
  },
  mounted() {
    this.checkUser();
  },
  methods: {
    async checkUser() {
      const token = Cookies.get("accessToken");

      if (!token) {
        this.isLoggedIn = false;
        this.isLoading = false;
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:3000/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          this.user = response.data; // Lưu thông tin user
          this.isLoggedIn = true;
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user:", error);
        this.isLoggedIn = false;
      } finally {
        this.isLoading = false;
      }
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    handleLogout() {
      Cookies.remove("accessToken");
      this.isLoggedIn = false;
      this.$router.push("/userlogin");
      isDropdownOpen = false;
    },
  },
};
</script>
<style scoped>
.navbar {
  height: 7vh;
  background: linear-gradient(135deg, #6948ff, #4a32cc);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  padding: 0 20px;
}

.logo {
  width: 45px;
  height: 45px;
  object-fit: contain;
}

.brand-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  letter-spacing: 1px;
}

.nav-link {
  font-size: 1rem;
  font-weight: 500;
  color: #ffffff !important;
  transition: color 0.3s ease-in-out;
}

.nav-link:hover {
  color: #ffd700 !important;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
}

.btn {
  background-color: #ffffff;
  color: #6948ff;
  font-weight: bold;
  border-radius: 8px;
  transition: background 0.3s, transform 0.2s;
}

.btn:hover {
  background: #ffd700;
  color: #4a32cc;
  transform: scale(1.05);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  transition: transform 0.2s;
}

.user-avatar:hover {
  transform: scale(1.1);
}
.user-icon {
  margin-left: 110px;
}

.logout {
  margin-left: 50px;
  right: 0;
  background-color: #03c0b0;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: bold;
  transition: all 0.3s ease-in-out;
  border: none;
  display: block;

  text-align: left;
}

.logout:hover {
  background-color: #05d4d7;

  box-shadow: 0px 4px 8px rgba(220, 53, 69, 0.3);
}
</style>
