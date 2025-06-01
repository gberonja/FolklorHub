<template>
    <div class="bg-white rounded-lg shadow overflow-hidden h-full flex flex-col">
        <div class="h-48 bg-gray-200 flex items-center justify-center">
            <slot name="image">
                <!-- Default placeholder image -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </slot>
        </div>
        <div class="p-6 flex-grow flex flex-col">
            <h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
            <p class="text-sm text-gray-500 mb-2">{{ subtitle }}</p>
            <p class="text-gray-600 mb-4 flex-grow">
                {{ description }}
            </p>
            <router-link :to="linkUrl" :class="linkColor" class="hover:underline mt-auto">
                {{ linkText }}
            </router-link>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        required: true
    },
    linkText: {
        type: String,
        required: true
    },
    linkUrl: {
        type: String,
        required: true
    },
    linkColor: {
        type: String,
        default: 'text-blue-600'
    }
})
</script>