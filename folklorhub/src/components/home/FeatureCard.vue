<template>
    <div class="bg-white p-6 rounded-lg shadow text-center">
        <div class="w-16 h-16 mx-auto mb-4" :class="iconColor">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
            </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
        <p class="text-gray-600">
            <slot></slot>
        </p>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true
    },
    iconColor: {
        type: String,
        default: 'text-gray-600'
    },
    iconPath: {
        type: String,
        required: true
    }
})
</script>