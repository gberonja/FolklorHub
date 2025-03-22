<template>
  <footer class="bg-gray-800 text-white py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Logo i opis -->
        <div>
          <h2 class="text-2xl font-serif font-bold text-white mb-4">FolklorHub</h2>
          <p class="text-gray-300">
            Digitalna platforma za očuvanje i promociju hrvatske folklorne baštine.
          </p>
        </div>

        <!-- Linkovi -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Brze poveznice</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/" class="text-gray-300 hover:text-white transition-colors">
                Početna
              </router-link>
            </li>
            <li>
              <router-link to="/katalog" class="text-gray-300 hover:text-white transition-colors">
                Katalog plesova i pjesama
              </router-link>
            </li>
            <li>
              <router-link
                to="/dogadjanja"
                class="text-gray-300 hover:text-white transition-colors"
              >
                Kalendar događanja
              </router-link>
            </li>
            <li>
              <router-link to="/forum" class="text-gray-300 hover:text-white transition-colors">
                Forum
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Kontakt -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Kontakt</h3>
          <p class="text-gray-300 mb-2">info@folklorhub.hr</p>
          <p class="text-gray-300 mb-4">Zagreb, Hrvatska</p>
        </div>
      </div>

      <div class="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
        <p>&copy; {{ new Date().getFullYear() }} FolklorHub. Sva prava pridržana.</p>
      </div>
    </div>
  </footer>
</template>
  
  <script>
export default {
  name: 'Footer',
}
</script>