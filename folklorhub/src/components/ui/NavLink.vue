<template>
    <router-link :to="to" :class="[
        'border-transparent text-gray-700 hover:text-red-600 border-b-2 hover:border-red-600',
        'h-full inline-flex items-center px-1 pt-1 text-sm font-medium',
        active ? 'border-red-600 text-red-600' : ''
    ]">
        <slot></slot>
    </router-link>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
    to: {
        type: [String, Object],
        required: true
    },
    active: {
        type: Boolean,
        default: false
    }
})
</script>