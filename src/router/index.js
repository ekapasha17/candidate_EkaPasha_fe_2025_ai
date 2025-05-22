import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/create',
      name: 'CreateCampaign',
      component: () => import('../views/CreateCampaign.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/campaign/:id',
      name: 'CampaignDetail',
      component: () => import('../views/CampaignDetail.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth state
  authStore.initializeAuth()
  
  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isLoggedIn) {
      next('/login')
    } else {
      next()
    }
  }
  // Check if route requires guest (not authenticated)
  else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (authStore.isLoggedIn) {
      next('/dashboard')
    } else {
      next()
    }
  }
  else {
    next()
  }
})

export default router