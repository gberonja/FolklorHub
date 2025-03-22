<template>
  <div>
    <!-- Hero sekcija -->
    <section class="bg-red-600 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">Dobrodošli u FolklorHub</h1>
          <p class="text-xl max-w-3xl mx-auto mb-8">Digitalni arhiv hrvatske folklorne baštine</p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <router-link to="/katalog" class="btn bg-white text-red-600 hover:bg-gray-100">
              Istraži katalog
            </router-link>
            <router-link
              to="/dogadjanja"
              class="btn bg-red-600 border border-white hover:bg-red-700"
            >
              Pogledaj događanja
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- O platformi -->
    <section class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">O FolklorHub platformi</h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            FolklorHub je digitalna platforma namijenjena očuvanju i promociji hrvatske folklorne
            baštine. Platforma omogućuje korisnicima pregledavanje folklornih plesova, pjesama i
            događanja.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
  
  <script>
export default {
  name: 'HomeView',
}
</script>