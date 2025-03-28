<template>
  <div>
    <!-- Hero sekcija -->
    <section class="bg-red-600 text-white py-16">
      <div class="container mx-auto px-4">
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
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">O FolklorHub platformi</h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            FolklorHub je digitalna platforma namijenjena očuvanju i promociji hrvatske folklorne
            baštine. Platforma omogućuje korisnicima pregledavanje folklornih plesova, pjesama i
            događanja, posebno prilagođena potrebama folkloraša i entuzijasta hrvatske tradicijske
            kulture.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow text-center">
            <div class="w-16 h-16 mx-auto mb-4 text-red-600">
              <!-- Ikona za katalog -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Digitalni katalog</h3>
            <p class="text-gray-600">
              Istražite našu bogatu zbirku folklornih plesova i pjesama iz svih regija Hrvatske.
            </p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow text-center">
            <div class="w-16 h-16 mx-auto mb-4 text-blue-600">
              <!-- Ikona za događaje -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Kalendar događanja</h3>
            <p class="text-gray-600">
              Budite u toku s nadolazećim smotrama, festivalima i drugim folklornim događanjima.
            </p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow text-center">
            <div class="w-16 h-16 mx-auto mb-4 text-green-600">
              <!-- Ikona za forum -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Forum za diskusiju</h3>
            <p class="text-gray-600">
              Povežite se s drugim folklorašima, postavljajte pitanja i dijelite svoja iskustva.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Najnoviji sadržaj -->
    <section class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Najnoviji sadržaj</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Izdvojeni ples -->
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="h-48 bg-gray-200"></div>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">Linđo</h3>
              <p class="text-sm text-gray-500 mb-2">Dubrovačka regija</p>
              <p class="text-gray-600 mb-4">
                Linđo je tradicionalni ples dubrovačkog područja koji se pleše uz pratnju
                lijerice...
              </p>
              <a href="#" class="text-red-600 hover:underline">Saznaj više →</a>
            </div>
          </div>

          <!-- Izdvojeni događaj -->
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="h-48 bg-gray-200"></div>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">Međunarodna smotra folklora</h3>
              <p class="text-sm text-gray-500 mb-2">Zagreb, 15.-20. srpnja</p>
              <p class="text-gray-600 mb-4">
                Najveća i najvažnija smotra folklornog stvaralaštva u Hrvatskoj...
              </p>
              <a href="#" class="text-blue-600 hover:underline">Saznaj više →</a>
            </div>
          </div>

          <!-- Izdvojena temu foruma -->
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="h-48 bg-gray-200"></div>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">Radionice folklornih plesova</h3>
              <p class="text-sm text-gray-500 mb-2">Forum diskusija</p>
              <p class="text-gray-600 mb-4">
                Rasprava o nadolazećim radionicama folklornih plesova diljem Hrvatske...
              </p>
              <a href="#" class="text-green-600 hover:underline">Pridruži se diskusiji →</a>
            </div>
          </div>
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