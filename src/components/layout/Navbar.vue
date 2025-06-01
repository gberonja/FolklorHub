<template>
  <nav class="bg-white shadow-md">
    <div class="container mx-auto px-4">
      <div class="flex justify-between h-16">
        <div class="flex">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="text-2xl font-serif font-bold text-red-600">
              FolklorHub
            </router-link>
          </div>

          <!-- Desktop Navigation Links -->
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <nav-link to="/" :active="route.path === '/'">
              Početna
            </nav-link>

            <nav-link to="/katalog" :active="route.path.includes('katalog')">
              Katalog
            </nav-link>

            <nav-link to="/dogadjanja" :active="route.path.includes('dogadjanja')">
              Događanja
            </nav-link>

            <nav-link to="/forum" :active="route.path.includes('forum')">
              Forum
            </nav-link>
          </div>
        </div>

        <!-- Mobile menu button -->
        <button @click="toggleMobileMenu"
          class="sm:hidden flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="!showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Prijava/Profil -->
        <div class="hidden sm:flex items-center">
          <template v-if="isAuthenticated">
            <div class="relative" ref="profileMenuContainer">
              <button @click="toggleProfileMenu" class="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100">
                <div class="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white">
                  {{ userInitials }}
                </div>
                <span class="hidden md:inline text-sm">{{ user.displayName }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20"
                  fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd" />
                </svg>
              </button>

              <!-- Profile dropdown menu -->
              <div v-if="showProfileMenu" class="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg z-10">
                <router-link to="/profil" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showProfileMenu = false">
                  Moj profil
                </router-link>
                <button @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Odjava
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <router-link to="/prijava" class="btn btn-primary"> Prijava </router-link>
          </template>
        </div>
      </div>
    </div>

    <!-- Mobilni meni -->
    <div v-if="showMobileMenu" class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <router-link to="/" class="block px-3 py-2 text-base font-medium hover:bg-gray-100"
          :class="{ 'text-red-600': route.path === '/' }" @click="showMobileMenu = false">
          Početna
        </router-link>

        <router-link to="/katalog" class="block px-3 py-2 text-base font-medium hover:bg-gray-100"
          :class="{ 'text-red-600': route.path.includes('katalog') }" @click="showMobileMenu = false">
          Katalog
        </router-link>

        <router-link to="/dogadjanja" class="block px-3 py-2 text-base font-medium hover:bg-gray-100"
          :class="{ 'text-red-600': route.path.includes('dogadjanja') }" @click="showMobileMenu = false">
          Događanja
        </router-link>

        <router-link to="/forum" class="block px-3 py-2 text-base font-medium hover:bg-gray-100"
          :class="{ 'text-red-600': route.path.includes('forum') }" @click="showMobileMenu = false">
          Forum
        </router-link>

        <!-- Mobile Auth Buttons -->
        <div class="px-3 py-2">
          <template v-if="isAuthenticated">
            <router-link to="/profil" class="block py-2 text-base font-medium hover:bg-gray-100"
              @click="showMobileMenu = false">
              Moj profil
            </router-link>
            <button @click="logout"
              class="block w-full text-left py-2 text-base font-medium text-red-600 hover:bg-gray-100">
              Odjava
            </button>
          </template>
          <template v-else>
            <router-link to="/prijava" class="block w-full text-center btn btn-primary" @click="showMobileMenu = false">
              Prijava
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import NavLink from '@/components/ui/NavLink.vue'


const route = useRoute()
const router = useRouter()
const userStore = useUserStore()


const showMobileMenu = ref(false)
const showProfileMenu = ref(false)
const profileMenuContainer = ref(null)


const isAuthenticated = computed(() => userStore.isAuthenticated)
const user = computed(() => userStore.user)
const userInitials = computed(() => {
  if (!user.value || !user.value.displayName) return 'G'

  const names = user.value.displayName.split(' ')
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase()
  }
  return names[0][0].toUpperCase()
})


const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  if (showMobileMenu.value) showProfileMenu.value = false
}

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const logout = async () => {
  const { success } = await userStore.logout()
  if (success) {
    showProfileMenu.value = false
    router.push('/')
  }
}


const handleClickOutside = (event) => {
  if (profileMenuContainer.value && !profileMenuContainer.value.contains(event.target)) {
    showProfileMenu.value = false
  }
}


watch(() => route.fullPath, () => {
  showMobileMenu.value = false
})


onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>