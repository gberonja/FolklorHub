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
                  <input id="filter-ples" type="checkbox" v-model="filters.tipPles"
                    class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                  <label for="filter-ples" class="ml-2 text-gray-700">Plesovi</label>
                </div>
                <div class="flex items-center">
                  <input id="filter-pjesma" type="checkbox" v-model="filters.tipPjesma"
                    class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
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

            <!-- Samo favoriti -->
            <div class="mb-4" v-if="userStore.isAuthenticated">
              <div class="flex items-center">
                <input id="filter-favoriti" type="checkbox" v-model="filters.onlyFavorites"
                  class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                <label for="filter-favoriti" class="ml-2 text-gray-700">Prikaži samo favorite</label>
              </div>
            </div>

            <!-- Gumb za resetiranje -->
            <button @click="resetFilters" class="w-full btn btn-secondary mt-2">
              Resetiraj filtere
            </button>
          </div>

          <!-- Popularni tagovi -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-semibold mb-3">Popularne regije</h3>
            <div class="flex flex-wrap gap-2">
              <button v-for="(count, region) in popularRegions" :key="region" @click="setRegionFilter(region)"
                class="px-2 py-1 text-sm rounded-full"
                :class="filters.regija === region ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'">
                {{ getRegionName(region) }} ({{ count }})
              </button>
            </div>
          </div>
        </div>

        <!-- Rezultati pretrage -->
        <div class="lg:col-span-3">
          <!-- Pretraživanje -->
          <div class="mb-6">
            <div class="relative">
              <input type="text" v-model="searchQuery" placeholder="Pretraživanje..." class="form-input pl-10" />
              <div class="absolute left-3 top-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

          <!-- Loading stanje -->
          <div v-if="catalogStore.loading" class="flex justify-center py-12">
            <svg class="animate-spin h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
          </div>

          <!-- Lista rezultata -->
          <div v-else-if="filteredItems.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <catalog-item-card v-for="item in filteredItems" :key="`${item.type}-${item.id}`" :item="item"
              @toggle-favorite="toggleFavorite" />
          </div>

          <!-- Nema rezultata -->
          <div v-else class="bg-white p-8 rounded-lg shadow text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCatalogStore } from '@/stores/catalog'
import { useUserStore } from '@/stores/user'
import CatalogItemCard from '@/components/catalog/CatalogItemCard.vue'

const catalogStore = useCatalogStore()
const userStore = useUserStore()

const searchQuery = ref('')
const filters = ref({
  tipPles: true,
  tipPjesma: true,
  regija: '',
  onlyFavorites: false
})
const sortBy = ref('name-asc')


const popularRegions = computed(() => {
  const regions = {}
  catalogStore.items.forEach(item => {
    regions[item.region] = (regions[item.region] || 0) + 1
  })
  return regions
})

const filteredItems = computed(() => {
  let result = catalogStore.items

  const types = []
  if (filters.value.tipPles) types.push('ples')
  if (filters.value.tipPjesma) types.push('pjesma')

  if (types.length > 0) {
    result = result.filter((item) => types.includes(item.type))
  }

  
  if (filters.value.regija) {
    result = result.filter((item) => item.region === filters.value.regija)
  }

  
  if (filters.value.onlyFavorites) {
    result = result.filter((item) =>
      catalogStore.isFavorite(item.id, item.type)
    )
  }

 
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.regionName.toLowerCase().includes(query)
    )
  }


  switch (sortBy.value) {
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
})


const resetFilters = () => {
  searchQuery.value = ''
  filters.value = {
    tipPles: true,
    tipPjesma: true,
    regija: '',
    onlyFavorites: false
  }
  sortBy.value = 'name-asc'
}

const setRegionFilter = (region) => {
  filters.value.regija = filters.value.regija === region ? '' : region
}

const getRegionName = (regionKey) => {
  const regionMap = {
    'dalmacija': 'Dalmacija',
    'istra-primorje': 'Istra i Primorje',
    'lika-banovina': 'Lika i Banovina',
    'slavonija': 'Slavonija',
    'podravina-posavina': 'Podravina i Posavina',
    'srednisnja-hrvatska': 'Središnja Hrvatska',
    'medjimurje': 'Međimurje',
    'zagorje': 'Zagorje'
  }
  return regionMap[regionKey] || regionKey
}

const toggleFavorite = async (item) => {
  if (!userStore.isAuthenticated) {
    alert('Morate biti prijavljeni za korištenje favorita!')
    return
  }

  const isFav = catalogStore.isFavorite(item.id, item.type)

  if (isFav) {
    await catalogStore.removeFromFavorites(item.id, item.type)
  } else {
    await catalogStore.addToFavorites(item.id, item.type)
  }
}


onMounted(async () => {
  if (catalogStore.items.length === 0) {
    await catalogStore.fetchItems()
  }
})


watch(() => userStore.isAuthenticated, (isAuth) => {
  if (isAuth) {
    catalogStore.fetchFavorites()
  }
})
</script>