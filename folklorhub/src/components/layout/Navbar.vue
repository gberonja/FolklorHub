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

          <!-- Navigation Links -->
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link
              to="/"
              class="border-transparent text-gray-700 hover:text-red-600 border-b-2 hover:border-red-600 h-full inline-flex items-center px-1 pt-1 text-sm font-medium"
              :class="{ 'border-red-600 text-red-600': $route.path === '/' }"
            >
              Početna
            </router-link>

            <router-link
              to="/katalog"
              class="border-transparent text-gray-700 hover:text-red-600 border-b-2 hover:border-red-600 h-full inline-flex items-center px-1 pt-1 text-sm font-medium"
              :class="{ 'border-red-600 text-red-600': $route.path.includes('katalog') }"
            >
              Katalog
            </router-link>

            <router-link
              to="/dogadjanja"
              class="border-transparent text-gray-700 hover:text-red-600 border-b-2 hover:border-red-600 h-full inline-flex items-center px-1 pt-1 text-sm font-medium"
              :class="{ 'border-red-600 text-red-600': $route.path.includes('dogadjanja') }"
            >
              Događanja
            </router-link>

            <router-link
              to="/forum"
              class="border-transparent text-gray-700 hover:text-red-600 border-b-2 hover:border-red-600 h-full inline-flex items-center px-1 pt-1 text-sm font-medium"
              :class="{ 'border-red-600 text-red-600': $route.path.includes('forum') }"
            >
              Forum
            </router-link>
          </div>
        </div>

        <!-- Prijava -->
        <div class="flex items-center">
          <router-link to="/prijava" class="btn btn-primary"> Prijava </router-link>
        </div>
      </div>
    </div>

    <!-- Mobilni meni -->
    <div class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <router-link
          to="/"
          class="block px-3 py-2 text-base font-medium hover:bg-gray-100"
          :class="{ 'text-red-600': $route.path === '/' }"
        >
          Početna
        </router-link>

        <router-link
          to="/katalog"
          class="block px-3 py-2 text-base font-medium hover:bg-gray-100"
          :class="{ 'text-red-600': $route.path.includes('katalog') }"
        >
          Katalog
        </router-link>

        <router-link
          to="/dogadjanja"
          class="block px-3 py-2 text-base font-medium hover:bg-gray-100"
          :class="{ 'text-red-600': $route.path.includes('dogadjanja') }"
        >
          Događanja
        </router-link>

        <router-link
          to="/forum"
          class="block px-3 py-2 text-base font-medium hover:bg-gray-100"
          :class="{ 'text-red-600': $route.path.includes('forum') }"
        >
          Forum
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
}
</script>