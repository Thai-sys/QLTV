import { createWebHistory, createRouter } from "vue-router";
import authRoutes from "./auth";
import adminRoutes from "./admin";
import bookRoutes from "./book";
const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/home/home.vue"),
  },
  {
    path: "/:path(.*)*",
    name: "notfound",
    component: () => import("@/views/NotFound.vue"),
  },
  ...authRoutes,
  ...adminRoutes,
  ...bookRoutes,
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
