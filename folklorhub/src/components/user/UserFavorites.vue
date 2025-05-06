<template>
    <div class="space-y-4">
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
            <div v-if="favoriteItems.length > 0" class="space-y-4">
                <div v-for="item in favoriteItems" :key="`${item.type}-${item.id}`"
                    class="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow flex">
                    <div class="flex-shrink-0 h-20 w-20 bg-gray-200 rounded-md mr-4 relative overflow-hidden">
                        <div class="absolute top-0 left-0 bg-red-600 text-white py-0.5 px-1.5 text-xs rounded-br">
                            {{ item.type === 'ples' ? 'Ples' : 'Pjesma' }}
                        </div>
                        <img v-if="item.mediaUrl" :src="item.mediaUrl" :alt="item.name"
                            class="h-full w-full object-cover" />
                    </div>

                    <div class="flex-grow">
                        <h3 class="text-lg font-semibold text-gray-900">{{ item.name }}</h3>
                        <p class="text-sm text-gray-500">{{ item.regionName }}</p>
                        <div class="mt-2 flex justify-between items-center">
                            <router-link :to="`/katalog/${item.type}/${item.id}`"
                                class="text-red-600 hover:underline text-sm">
                                Pregledaj →
                            </router-link>
                            <button @click="removeFromFavorites(item)"
                                class="text-gray-500 hover:text-red-600 text-sm flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none"
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

            <!-- No favorites message -->
            <div v-else class="text-center py-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p class="mb-2">Još nemate dodanih favorita.</p>
                <router-link to="/katalog" class="text-red-600 hover:underline">Istražite katalog i dodajte omiljene
                    plesove i pjesme!</router-link>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
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


const favoriteItems = computed(() => {
    return catalogStore.getFavoriteItems
})


const removeFromFavorites = async (item) => {
    try {
        loading.value = true

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
        loading.value = false
    }
}


onMounted(async () => {
    try {
        loading.value = true


        if (catalogStore.items.length === 0) {
            await catalogStore.fetchItems()
        }


        await catalogStore.fetchFavorites()
    } catch (error) {
        console.error('Error loading favorites:', error)
    } finally {
        loading.value = false
    }
})
</script>