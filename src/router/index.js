import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Dashboard from '@/views/Dashboard.vue';

const routes = [
  { 
    path: '/login', 
    name: 'Login', 
    component: Login 
  },
  { 
    path: '/register', 
    name: 'Register', 
    component: Register 
  },
  { 
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }, // This marks the route as requiring authentication
  },
  { 
    path: '/:pathMatch(.*)*', 
    redirect: '/login' // Redirect to login if the path doesn't match any route
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global navigation guard to check for authentication
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    next('/login','register');
  } else {
    next();
  }
});

// Handle router errors
router.onError((error) => {
  console.error('Router error:', error);
});

export default router;
