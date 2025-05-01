<template>
    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-start">
            <div class="flex-shrink-0 mr-4">
                <div class="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                    {{ userInitials }}
                </div>
            </div>
            <div class="flex-grow">
                <div class="flex justify-between">
                    <div>
                        <span class="font-medium text-gray-900">{{ comment.author }}</span>
                        <span class="text-sm text-gray-500 ml-2">{{ formatDate(comment.createdAt) }}</span>
                    </div>
                    <button v-if="showOptions" class="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                    </button>
                </div>

                <p class="mt-2 text-gray-800 whitespace-pre-line">{{ comment.content }}</p>

                <div class="mt-3 flex space-x-2">
                    <button class="text-gray-500 hover:text-gray-700 text-sm flex items-center"
                        @click="$emit('like', comment.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        Sviđa mi se ({{ comment.likes }})
                    </button>
                    <button class="text-gray-500 hover:text-gray-700 text-sm flex items-center"
                        @click="$emit('reply', comment)">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Odgovori
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { parseISO, format } from 'date-fns'
import { hr } from 'date-fns/locale'
import { useUserStore } from '@/stores/user'

const props = defineProps({
    comment: {
        type: Object,
        required: true
    },
    showOptions: {
        type: Boolean,
        default: false
    }
})

defineEmits(['like', 'reply'])

const userStore = useUserStore()

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


const userInitials = computed(() => {
    if (!props.comment.author) return 'G'

    const names = props.comment.author.split(' ')
    if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase()
    }
    return names[0][0].toUpperCase()
})

const isCurrentUser = computed(() => {
    return userStore.user && props.comment.authorId === userStore.user.id
})
</script>