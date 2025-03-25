<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <ul>
        <li
          @click="activeComponent = 'User'"
          :class="{ active: activeComponent === 'User' }"
        >
          Quản lý người dùng
        </li>
        <li
          @click="activeComponent = 'Book'"
          :class="{
            active:
              activeComponent === 'Book' ||
              activeComponent === 'AddBook' ||
              activeComponent === 'EditBook',
          }"
        >
          Quản lý sách
        </li>
        <li
          @click="activeComponent = 'Service'"
          :class="{ active: activeComponent === 'Service' }"
        >
          Quản lý dịch vụ mượn sách
        </li>
      </ul>

      <!-- Đăng xuất -->
      <button class="logout-btn" @click="handleLogout">Đăng xuất</button>
    </aside>

    <!-- Main Content -->
    <main class="content">
      <User v-if="activeComponent === 'User'" />
      <Book
        v-if="activeComponent === 'Book'"
        @changeComponent="
          (component, book) => {
            activeComponent = component;
            if (component === 'EditBook') editedBook = book;
          }
        "
      />

      <Service v-if="activeComponent === 'Service'" />
      <AddBook
        v-if="activeComponent === 'AddBook'"
        @changeComponent="handleComponentChange"
      />

      <EditBook
  v-if="activeComponent === 'EditBook'"
  :book="editedBook"
  @changeComponent="activeComponent = 'Book'"
/>

    </main>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import User from "@/components/admindashboard/admin_user.vue";
import Book from "@/components/admindashboard/admin_book.vue";
import Service from "@/components/admindashboard/admin_service.vue";
import AddBook from "@/components/admindashboard/admin_addbook.vue";
import EditBook from "@/components/admindashboard/admin_editbook.vue";
export default {
  components: { User, Book, Service, AddBook, EditBook },
  data() {
    return {
      activeComponent: "User",
      editedBook: null, // Lưu sách cần sửa
    };
  },
  methods: {
    handleLogout() {
      Cookies.remove("accessToken");
      this.$router.push("/userlogin");
    },
    handleComponentChange(component) {
      console.log("Chuyển đổi component:", component);
      this.activeComponent = component;
    },
  },
};
</script>

<style scoped>
/* Định dạng container tổng */
.dashboard-container {
  display: flex;
  height: 100vh;
}

/* Sidebar */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 220px;
  height: 100vh;
  background: #2c3e50;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
}

/* Danh sách menu */
.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  padding: 12px 15px;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s;
  font-size: 16px;
}

.sidebar li:hover,
.sidebar .active {
  background: #1abc9c;
  color: #fff;
  transform: scale(1.05);
}

/* Nút đăng xuất */
.logout-btn {
  padding: 12px;
  background: #e74c3c;
  color: white;
  border: none;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
  border-radius: 5px;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: #c0392b;
  transform: scale(1.05);
}

/* Nội dung chính (main content) */
.content {
  flex: 1;

  padding: 20px;
}
</style>
