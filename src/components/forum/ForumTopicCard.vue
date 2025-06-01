<template>
    <div class="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
        <div class="p-6">
            <div class="flex justify-between items-start">
                <div>
                    <router-link :to="`/forum/tema/${topic.id}`"
                        class="text-xl font-semibold text-red-600 hover:underline">
                        {{ topic.title }}
                    </router-link>
                    <p class="mt-2 text-gray-600 line-clamp-2">
                        {{ topic.description }}
                    </p>
                </div>
                <div class="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-3 text-center">
                    <span class="text-2xl font-bold text-gray-700">{{ topic.commentsCount }}</span>
                    <span class="text-xs text-gray-500">odgovora</span>
                </div>
            </div>

            <div class="mt-4 flex flex-wrap items-center text-sm text-gray-500">
                <div class="flex items-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{{ topic.author }}</span>
                </div>
                <div class="flex items-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Kreirano: {{ formatDate(topic.createdAt) }}</span>
                </div>
                <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Zadnji odgovor: {{ formatDate(topic.lastReplyAt) }}</span>
                </div>
            </div>

            <div class="mt-4" v-if="topic.tags && topic.tags.length > 0">
                <div class="flex flex-wrap gap-2">
                    <span v-for="tag in topic.tags" :key="tag"
                        class="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                        {{ tag }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { format, parseISO } from 'date-fns'
import { hr } from 'date-fns/locale'

const props = defineProps({
    topic: {
        type: Object,
        required: true
    }
})


const formatDate = (dateString) => {
    if (!dateString) return ''

    try {
        const date = parseISO(dateString)
        return format(date, 'dd.MM.yyyy. HH:mm', { locale: hr })
    } catch (err) {
        console.error('Date formatting error:', err)
        return dateString
    }
}
</script>