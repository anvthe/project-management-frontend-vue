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
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token');
      if (token) {
        next();
      } else {
        next('/login');
      }
    },
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

router.onError((error) => {
  console.error('Router error:', error);
});

export default router;
