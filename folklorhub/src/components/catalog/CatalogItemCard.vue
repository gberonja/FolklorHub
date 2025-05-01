<template>
    <div class="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
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
            <router-link :to="`/katalog/${item.type}/${item.id}`" class="text-red-600 hover:underline">
                Saznaj više →
            </router-link>
        </div>
    </div>
</template>

<script setup>
defineProps({
    item: {
        type: Object,
        required: true
    }
})
</script>