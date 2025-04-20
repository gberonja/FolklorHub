import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/katalog',
      name: 'katalog',
      component: () => import('../views/KatalogView.vue')
    },
    {
      path: '/katalog/:type/:id',
      name: 'katalog-detalji',
      component: () => import('../views/KatalogDetailView.vue')
    },
    {
      path: '/dogadjanja',
      name: 'dogadjanja',
      component: () => import('../views/DogadjanjaView.vue')
    },
    {
      path: '/forum',
      name: 'forum',
      component: () => import('../views/ForumView.vue')
    },
    {
      path: '/forum/tema/:id',
      name: 'forum-topic',
      component: () => import('../views/ForumTopicView.vue')
    },
    {
      path: '/prijava',
      name: 'auth',
      component: () => import('../views/AuthView.vue')
    },
    {
      path: '/profil',
      name: 'profil',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})


router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const user = localStorage.getItem('user');
  
  if (requiresAuth && !user) {
    next('/prijava');
  } else {
    next();
  }
});

export default router