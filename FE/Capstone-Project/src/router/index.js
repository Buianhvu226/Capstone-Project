import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AuthView from "../views/AuthView.vue";
import ProfileCreateView from "../views/ProfileCreateView.vue";
import ProfileDetailView from "../views/ProfileDetailView.vue";
import SearchView from "@/views/SearchView.vue";
import ProfileEditView from "../views/ProfileEditView.vue";
import NotificationsPage from "@/views/NotificationsPage.vue";
import ProfileImagePage from "@/views/ProfileImagePage.vue";
import MyProfile from "@/views/MyProfile.vue";
import MessagesView from "@/views/MessagesView.vue";
import AccountView from "@/views/AccountView.vue"; // ✅ Import AccountView

// Cập nhật danh sách routes với các đường dẫn cho recently-missing
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: false },
  },
  {
    path: "/auth",
    name: "auth",
    component: AuthView,
    meta: { guest: true },
  },
  {
    path: "/profile/create",
    name: "profile-create",
    component: ProfileCreateView,
    meta: { requiresAuth: true },
  },
  {
    path: "/profiles/:id/upload-image",
    name: "ProfileImageUpload",
    component: ProfileImagePage,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile/:id",
    name: "profile-detail",
    component: ProfileDetailView,
    meta: { requiresAuth: false },
  },
  {
    path: "/search",
    name: "search",
    component: SearchView,
    meta: {
      requiresAuth: false,
      title: "Tìm kiếm hồ sơ",
    },
  },
  {
    path: "/my-profile",
    name: "my-profile",
    component: MyProfile,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile/edit/:id",
    name: "profile-edit",
    component: ProfileEditView,
    meta: { requiresAuth: true },
  },
  // ✅ Thêm route cho Account
  {
    path: "/account",
    name: "account",
    component: AccountView,
    meta: {
      requiresAuth: true,
      title: "Tài khoản của tôi",
    },
  },
  {
    path: "/notifications",
    name: "notifications",
    component: NotificationsPage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/messages",
    name: "messages",
    component: MessagesView,
    meta: {
      requiresAuth: true,
      title: "Tin nhắn",
    },
  },
  {
    path: "/recently-missing",
    name: "recently-missing-list",
    component: () => import("../views/RecentlyMissingListView.vue"),
    meta: {
      requiresAuth: false,
      title: "Người thất lạc gần đây",
    },
  },
  {
    path: "/recently-missing/create",
    name: "recently-missing-create",
    component: () => import("../views/RecentlyMissingCreateView.vue"),
    meta: {
      requiresAuth: true,
      title: "Đăng hồ sơ người thất lạc gần đây",
    },
  },
  {
    path: "/recently-missing/:id",
    name: "recently-missing-detail",
    component: () => import("../views/RecentlyMissingDetailView.vue"),
    meta: {
      requiresAuth: false,
      title: "Chi tiết người thất lạc",
    },
  },
  {
    path: "/recently-missing/edit/:id",
    name: "recently-missing-edit",
    component: () => import("../views/RecentlyMissingEditView.vue"),
    meta: {
      requiresAuth: true,
      title: "Chỉnh sửa hồ sơ người thất lạc",
    },
  },
  {
    path: "/recently-missing/:id/upload-image",
    name: "recently-missing-upload-image",
    component: () => import("../views/RecentlyMissingImageUpload.vue"),
    meta: {
      requiresAuth: true,
      title: "Tải lên ảnh khuôn mặt",
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("token");

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: "auth" });
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (isAuthenticated) {
      next({ name: "home" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
