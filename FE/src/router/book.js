const bookRoutes = [
  {
    path: "/details-book",
    name: "detailsbook",
    component: () => import("@/views/book/details_book.vue"),
    props: true,
  },
  {
    path: "/service-book",
    name: "servicebook",
    component: () => import("@/views/book/service_book.vue"),
    props: true,
  },
  {
    path: "/book-service-list",
    name: "bookservicelist",
    component: () => import("@/views/book/book_service_list.vue"),
  },
];

export default bookRoutes;
