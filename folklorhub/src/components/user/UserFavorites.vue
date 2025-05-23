<template>
    <div class="space-y-4">
        <!-- Filter controls -->
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="flex-1">
                <input type="text" v-model="searchQuery" placeholder="Pretraži favorite..." class="form-input" />
            </div>
            <div class="flex gap-2">
                <button @click="filterType = 'all'" :class="filterType === 'all' ? 'btn-primary' : 'btn-secondary'"
                    class="btn">
                    Sve ({{ favoriteItems.length }})
                </button>
                <button @click="filterType = 'ples'" :class="filterType === 'ples' ? 'btn-primary' : 'btn-secondary'"
                    class="btn">
                    Plesovi ({{ danceCount }})
                </button>
                <button @click="filterType = 'pjesma'"
                    :class="filterType === 'pjesma' ? 'btn-primary' : 'btn-secondary'" class="btn">
                    Pjesme ({{ songCount }})
                </button>
            </div>
        </div>

        <div v-if="loading" class="flex justify-center py-8">
            <svg class="animate-spin h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
            </svg>
        </div>

        <template v-else>
            <!-- Favorite Items -->
            <div v-if="filteredFavorites.length > 0" class="space-y-4">
                <div v-for="item in filteredFavorites" :key="`${item.type}-${item.id}`"
                    class="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                    <div class="flex">
                        <div class="flex-shrink-0 h-20 w-20 bg-gray-200 rounded-md mr-4 relative overflow-hidden">
                            <div class="absolute top-0 left-0 bg-red-600 text-white py-0.5 px-1.5 text-xs rounded-br">
                                {{ item.type === 'ples' ? 'Ples' : 'Pjesma' }}
                            </div>
                            <img v-if="item.mediaUrl" :src="item.mediaUrl" :alt="item.name"
                                class="h-full w-full object-cover" />
                            <div v-else class="h-full w-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path v-if="item.type === 'ples'" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                            </div>
                        </div>

                        <div class="flex-grow">
                            <h3 class="text-lg font-semibold text-gray-900">{{ item.name }}</h3>
                            <p class="text-sm text-gray-500 mb-1">{{ item.regionName }}</p>
                            <p class="text-gray-600 text-sm line-clamp-2 mb-3">{{ item.description }}</p>

                            <div class="flex justify-between items-center">
                                <router-link :to="`/katalog/${item.type}/${item.id}`"
                                    class="text-red-600 hover:underline text-sm font-medium flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Pregledaj
                                </router-link>

                                <button @click="removeFromFavorites(item)"
                                    class="text-gray-500 hover:text-red-600 text-sm flex items-center transition-colors"
                                    :disabled="removing === item.id">
                                    <svg v-if="removing === item.id" class="animate-spin h-4 w-4 mr-1"
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                        </path>
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Ukloni
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- No favorites message -->
            <div v-else-if="favoriteItems.length === 0" class="text-center py-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p class="mb-2 text-lg">Još nemate dodanih favorita.</p>
                <p class="text-sm text-gray-400 mb-4">Dodajte plesove i pjesme u favorite da ih lakše pronađete!</p>
                <router-link to="/katalog" class="text-red-600 hover:underline font-medium">
                    Istražite katalog →
                </router-link>
            </div>

            <!-- No filtered results -->
            <div v-else class="text-center py-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p class="mb-2">Nema rezultata za "{{ searchQuery }}"</p>
                <p class="text-sm text-gray-400">Pokušajte s drugim pojmom za pretraživanje.</p>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCatalogStore } from '@/stores/catalog'

const props = defineProps({
    userId: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['update'])

const catalogStore = useCatalogStore()
const loading = ref(true)
const removing = ref(null)
const searchQuery = ref('')
const filterType = ref('all') // 'all', 'ples', 'pjesma'

// Get favorite items from store
const favoriteItems = computed(() => {
    return catalogStore.getFavoriteItems
})

// Filter favorites based on search and type
const filteredFavorites = computed(() => {
    let items = favoriteItems.value

    // Filter by type
    if (filterType.value !== 'all') {
        items = items.filter(item => item.type === filterType.value)
    }

    // Filter by search query
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        items = items.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.regionName.toLowerCase().includes(query)
        )
    }

    return items
})

// Count favorites by type
const danceCount = computed(() => {
    return favoriteItems.value.filter(item => item.type === 'ples').length
})

const songCount = computed(() => {
    return favoriteItems.value.filter(item => item.type === 'pjesma').length
})

// Remove item from favorites
const removeFromFavorites = async (item) => {
    try {
        removing.value = item.id

        const result = await catalogStore.removeFromFavorites(item.id, item.type)

        if (result.success) {
            emit('update')
        } else {
            alert(`Greška: ${result.error || 'Nije moguće ukloniti iz favorita'}`)
        }
    } catch (error) {
        console.error('Error removing favorite:', error)
        alert('Došlo je do greške prilikom uklanjanja iz favorita.')
    } finally {
        removing.value = null
    }
}

// Load data on component mount
onMounted(async () => {
    try {
        loading.value = true

        // Ensure catalog items are loaded
        if (catalogStore.items.length === 0) {
            await catalogStore.fetchItems()
        }

        // Fetch user's favorites
        await catalogStore.fetchFavorites()
    } catch (error) {
        console.error('Error loading favorites:', error)
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>