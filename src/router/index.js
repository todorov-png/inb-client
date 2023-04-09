import { createRouter, createWebHistory } from 'vue-router';
import AuthLayout from '@/layouts/AuthLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import RegisterView from '@/views/RegisterView.vue';
import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import LandView from '@/views/LandView.vue';
import store from '@/store/index.js';

const routes = [
  {
    path: '/',
    name: 'main',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'home',
        meta: { requiresAuth: true },
        component: HomeView,
      },
      {
        path: 'land',
        name: 'land',
        meta: { requiresAuth: true },
        component: LandView,
      },
    ],
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'login',
        meta: { guest: true },
        component: LoginView,
      },
      {
        path: 'register',
        name: 'register',
        meta: { guest: true },
        component: RegisterView,
      },
    ],
  },
  {
    name: '404',
    path: '/:notFound(.*)*',
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  mode: 'history',
  routes,
});

router.beforeEach(async (to, from, next) => {
  console.log(to);
  const isAuthenticated = await store.dispatch('checkAuth');
  const matched = to.matched;
  for (let i = 0; i < matched.length; i++) {
    const meta = matched[i].meta;
    switch (true) {
      case meta.requiresAuth && !isAuthenticated:
        return next('/auth');
      case meta.guest && isAuthenticated:
        return next('/');
    }
  }
  next();
});

export default router;

