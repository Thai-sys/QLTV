const adminRoutes = [
  {
    path: "/admindashboard",
    name: "admindashboard",
    component: () => import("@/views/admin/admin_dashboard.vue"),
  },
];

export default adminRoutes;
