<template>
    <div class="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
        <div class="h-40 bg-gray-200 relative">
            <div class="absolute top-0 left-0 bg-red-600 text-white py-1 px-3 text-sm">
                {{ item.type === 'ples' ? 'Ples' : 'Pjesma' }}
            </div>
            
            <!-- Favorite button -->
            <button @click.prevent="$emit('toggle-favorite', item)" 
                    class="absolute top-0 right-0 bg-white p-2 m-2 rounded-full shadow hover:bg-gray-100 transition-colors"
                    v-if="userStore.isAuthenticated">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="isFavorite ? 'text-red-600' : 'text-gray-400'" 
                     fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>
        </div>

        <div class="p-4">
            <h3 class="text-xl font-semibold mb-2">{{ item.name }}</h3>
            <p class="text-sm text-gray-500 mb-2">{{ item.regionName }}</p>
            <p class="text-gray-600 mb-4 line-clamp-2">
                {{ item.description }}
            </p>
            <div class="flex justify-between items-center">
                <router-link :to="`/katalog/${item.type}/${item.id}`" class="text-red-600 hover:underline">
                    Saznaj više →
                </router-link>
                
                <span v-if="isFavorite" class="text-xs text-red-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Favorit
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { useCatalogStore } from '@/stores/catalog'
import { useUserStore } from '@/stores/user'

const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})

defineEmits(['toggle-favorite'])

const catalogStore = useCatalogStore()
const userStore = useUserStore()

const isFavorite = computed(() => {
    return catalogStore.isFavorite(props.item.id, props.item.type)
})
</script>