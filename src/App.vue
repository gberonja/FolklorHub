<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()

onMounted(async () => {
  await userStore.fetchUser()
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>