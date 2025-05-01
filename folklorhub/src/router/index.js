import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import HomeView from '@/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/katalog',
    name: 'katalog',
    component: () => import('@/views/KatalogView.vue')
  },
  {
    path: '/katalog/:type/:id',
    name: 'katalog-detalji',
    component: () => import('@/views/KatalogDetailView.vue')
  },
  {
    path: '/dogadjanja',
    name: 'dogadjanja',
    component: () => import('@/views/DogadjanjaView.vue')
  },
  {
    path: '/forum',
    name: 'forum',
    component: () => import('@/views/ForumView.vue')
  },
  {
    path: '/forum/tema/:id',
    name: 'forum-tema',
    component: () => import('@/views/ForumTopicView.vue')
  },
  {
    path: '/prijava',
    name: 'auth',
    component: () => import('@/views/AuthView.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/profil',
    name: 'profil',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})


router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {

    next({ name: 'auth', query: { redirect: to.fullPath } })
  } else if (to.meta.guestOnly && userStore.isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router