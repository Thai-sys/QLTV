
const userRoutes = [
  {
    path: "/userlogin",
    name: "userlogin",
    component: () => import("@/views/auth/user_login.vue"),
  },
  {
    path: "/adminlogin",
    name: "adminlogin",
    component: () => import("@/views/auth/admin_login.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/auth/register.vue"),
  },
];

export default userRoutes;
