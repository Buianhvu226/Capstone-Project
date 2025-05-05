import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import ProfileCreateView from '../views/ProfileCreateView.vue'
import ProfileDetailView from '../views/ProfileDetailView.vue'
import MessageView from '../views/MessageView.vue'

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
    meta: { requiresAuth: false },
  },
  {
    path: "/profile/:id",
    name: "profile-detail",
    component: ProfileDetailView,
    meta: { requiresAuth: false },
  },
  {
    path: "/messages",
    name: "messages",
    component: MessageView,
    meta: { requiresAuth: false },
  },
  {
    path: "/messages/:userId",
    name: "message-detail",
    component: MessageView,
    meta: { requiresAuth: false },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'auth' })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (isAuthenticated) {
      next({ name: 'home' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
