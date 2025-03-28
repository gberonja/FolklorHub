<template>
  <div class="py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Katalog plesova i pjesama</h1>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Filteri -->
        <div class="lg:col-span-1">
          <div class="bg-white p-6 rounded-lg shadow mb-6">
            <h2 class="text-xl font-semibold mb-4">Filteri</h2>

            <!-- Tip sadržaja -->
            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">Tip sadržaja</label>
              <div class="space-y-2">
                <div class="flex items-center">
                  <input
                    id="filter-ples"
                    type="checkbox"
                    v-model="filters.tipPles"
                    class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label for="filter-ples" class="ml-2 text-gray-700">Plesovi</label>
                </div>
                <div class="flex items-center">
                  <input
                    id="filter-pjesma"
                    type="checkbox"
                    v-model="filters.tipPjesma"
                    class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label for="filter-pjesma" class="ml-2 text-gray-700">Pjesme</label>
                </div>
              </div>
            </div>

            <!-- Regija -->
            <div class="mb-4">
              <label for="filter-regija" class="block text-gray-700 font-medium mb-2">Regija</label>
              <select id="filter-regija" v-model="filters.regija" class="form-input">
                <option value="">Sve regije</option>
                <option value="dalmacija">Dalmacija</option>
                <option value="istra-primorje">Istra i Primorje</option>
                <option value="lika-banovina">Lika i Banovina</option>
                <option value="slavonija">Slavonija</option>
                <option value="podravina-posavina">Podravina i Posavina</option>
                <option value="srednisnja-hrvatska">Središnja Hrvatska</option>
                <option value="medjimurje">Međimurje</option>
                <option value="zagorje">Zagorje</option>
              </select>
            </div>

            <!-- Gumb za resetiranje -->
            <button @click="resetFilters" class="w-full btn btn-secondary">
              Resetiraj filtere
            </button>
          </div>
        </div>

        <!-- Rezultati pretrage -->
        <div class="lg:col-span-3">
          <!-- Pretraživanje -->
          <div class="mb-6">
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Pretraživanje..."
                class="form-input pl-10"
              />
              <div class="absolute left-3 top-3 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Broj rezultata i sortiranje -->
          <div class="flex flex-col sm:flex-row justify-between items-center mb-6">
            <p class="text-gray-600 mb-2 sm:mb-0">{{ filteredItems.length }} rezultata</p>

            <div class="flex items-center">
              <label for="sort" class="mr-2 text-gray-700">Sortiraj po:</label>
              <select id="sort" v-model="sortBy" class="form-input py-1 w-44">
                <option value="name-asc">Naziv (A-Ž)</option>
                <option value="name-desc">Naziv (Ž-A)</option>
                <option value="region">Regija</option>
              </select>
            </div>
          </div>

          <!-- Lista rezultata -->
          <div
            v-if="filteredItems.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <div
              v-for="item in filteredItems"
              :key="item.id"
              class="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div class="h-40 bg-gray-200 relative">
                <div class="absolute top-0 left-0 bg-red-600 text-white py-1 px-3 text-sm">
                  {{ item.type === 'ples' ? 'Ples' : 'Pjesma' }}
                </div>
              </div>

              <div class="p-4">
                <h3 class="text-xl font-semibold mb-2">{{ item.name }}</h3>
                <p class="text-sm text-gray-500 mb-2">{{ item.regionName }}</p>
                <p class="text-gray-600 mb-4 line-clamp-2">
                  {{ item.description }}
                </p>
                <router-link
                  :to="`/katalog/${item.type}/${item.id}`"
                  class="text-red-600 hover:underline"
                >
                  Saznaj više →
                </router-link>
              </div>
            </div>
          </div>

          <!-- Nema rezultata -->
          <div v-else class="bg-white p-8 rounded-lg shadow text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 text-gray-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 class="text-xl font-semibold mb-2">Nema rezultata</h3>
            <p class="text-gray-600 mb-4">
              Nije pronađen niti jedan rezultat koji odgovara vašim filterima.
            </p>
            <button @click="resetFilters" class="btn btn-primary">Resetiraj filtere</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
export default {
  name: 'KatalogView',
  data() {
    return {
      searchQuery: '',
      filters: {
        tipPles: true,
        tipPjesma: true,
        regija: '',
      },
      sortBy: 'name-asc',
      // Ovo su dummy podaci koje ćemo kasnije zamijeniti s podacima iz Firebase-a
      items: [
        {
          id: 'lindjo',
          name: 'Linđo',
          type: 'ples',
          region: 'dalmacija',
          regionName: 'Dubrovačko-neretvanska',
          description:
            'Linđo je tradicionalni narodni ples dubrovačkog područja, izvodi se uz zvuke lijerice. Plesače predvodi kolovođa koji glasno izvikuje naredbe.',
        },
        {
          id: 'kolo',
          name: 'Slavonsko kolo',
          type: 'ples',
          region: 'slavonija',
          regionName: 'Slavonija',
          description:
            'Slavonsko kolo je tradicionalni narodni ples Slavonije. Ples se izvodi u zatvorenom kolu, uz pjesmu ili tamburašku glazbu.',
        },
        {
          id: 'drmes',
          name: 'Drmeš',
          type: 'ples',
          region: 'srednisnja-hrvatska',
          regionName: 'Središnja Hrvatska',
          description:
            'Drmeš je narodni ples karakterističan za područje sjeverne i središnje Hrvatske. Dobio je ime po svojoj karakterističnoj strukturi u kojoj plesači "drmaju" tijelom gore-dolje.',
        },
        {
          id: 'balun',
          name: 'Balun',
          type: 'ples',
          region: 'istra-primorje',
          regionName: 'Istra',
          description:
            'Balun je tradicionalni istarski narodni ples. Karakterizira ga plesanje u parovima, koji se okreću u krug uz pratnju miha (istarske gajde) ili roženica.',
        },
        {
          id: 'ojkavica',
          name: 'Ojkavica',
          type: 'pjesma',
          region: 'lika-banovina',
          regionName: 'Lika',
          description:
            'Ojkavica je tradicijsko dvoglasno grleno pjevanje karakteristično za dinarsko područje. UNESCO ju je uvrstio na popis nematerijalne kulturne baštine.',
        },
        {
          id: 'becarac',
          name: 'Bećarac',
          type: 'pjesma',
          region: 'slavonija',
          regionName: 'Slavonija',
          description:
            'Bećarac je napjev koji se izvodi u Slavoniji, Baranji i Srijemu. Karakteriziraju ga deseterački dvostihovi vedrog i šaljivog sadržaja. UNESCO ga je uvrstio na popis nematerijalne kulturne baštine.',
        },
      ],
    }
  },
  computed: {
    filteredItems() {
      let result = this.items

      // Filtriranje po tipu
      const types = []
      if (this.filters.tipPles) types.push('ples')
      if (this.filters.tipPjesma) types.push('pjesma')

      if (types.length > 0) {
        result = result.filter((item) => types.includes(item.type))
      }

      // Filtriranje po regiji
      if (this.filters.regija) {
        result = result.filter((item) => item.region === this.filters.regija)
      }

      // Pretraživanje
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.regionName.toLowerCase().includes(query)
        )
      }

      // Sortiranje
      switch (this.sortBy) {
        case 'name-asc':
          result.sort((a, b) => a.name.localeCompare(b.name, 'hr'))
          break
        case 'name-desc':
          result.sort((a, b) => b.name.localeCompare(a.name, 'hr'))
          break
        case 'region':
          result.sort((a, b) => a.regionName.localeCompare(b.regionName, 'hr'))
          break
      }

      return result
    },
  },
  methods: {
    resetFilters() {
      this.searchQuery = ''
      this.filters = {
        tipPles: true,
        tipPjesma: true,
        regija: '',
      }
      this.sortBy = 'name-asc'
    },
  },
}
</script>