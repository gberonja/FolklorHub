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
      // Koristimo lazy-loading za ovu rutu
      component: () => import('../views/KatalogView.vue')
    },

    {
      path: '/dogadjanja',
      name: 'dogadjanja',
      component: () => import('../views/DogadjanjaView.vue')
    },
    /*
    {
      path: '/forum',
      name: 'forum',
      component: () => import('../views/ForumView.vue')
    },
    {
      path: '/prijava',
      name: 'prijava',
      component: () => import('../views/AuthView.vue')
    } */
  ]
})

export default router