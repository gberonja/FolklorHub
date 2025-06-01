<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div class="p-6">
                <div class="flex justify-between items-start">
                    <h2 class="text-2xl font-bold">{{ event.title }}</h2>
                    <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="md:col-span-2 space-y-4">
                        <div>
                            <span class="inline-block px-2 py-1 text-xs rounded-full text-white" :class="{
                                'bg-red-600': event.type === 'smotra',
                                'bg-blue-600': event.type === 'festival',
                                'bg-green-600': event.type === 'radionica',
                            }">
                                {{ eventTypeLabel }}
                            </span>
                        </div>

                        <p class="text-gray-700">{{ event.description }}</p>

                        <div class="space-y-2">
                            <div class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>
                                    <strong>Početak:</strong> {{ formatDate(event.date) }}
                                </span>
                            </div>

                            <div v-if="event.endDate" class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>
                                    <strong>Kraj:</strong> {{ formatDate(event.endDate) }}
                                </span>
                            </div>

                            <div class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>
                                    <strong>Lokacija:</strong> {{ event.location }}
                                </span>
                            </div>

                            <div v-if="event.organizer" class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>
                                    <strong>Organizator:</strong> {{ event.organizer }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="md:col-span-1">
                        <div class="bg-gray-100 p-4 rounded-lg">
                            <h3 class="font-semibold text-lg mb-2">Kontakt</h3>
                            <div class="space-y-2">
                                <div v-if="event.website">
                                    <a :href="event.website" target="_blank"
                                        class="text-red-600 hover:underline flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                        Web stranica
                                    </a>
                                </div>
                                <div v-if="event.email">
                                    <a :href="`mailto:${event.email}`"
                                        class="text-red-600 hover:underline flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Email
                                    </a>
                                </div>
                            </div>
                        </div>

                        <!-- Dodaj u kalendar -->
                        <div class="mt-4">
                            <button @click="addToCalendar"
                                class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-2" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Dodaj u kalendar
                            </button>
                        </div>

                        <!-- Dijeli događaj -->
                        <div class="mt-2">
                            <button @click="shareEvent"
                                class="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-2" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                Dijeli događaj
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Povezani sadržaji -->
                <div class="mt-8">
                    <h3 class="text-lg font-semibold mb-4">Povezani sadržaji</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div v-if="relatedCatalogItems.length > 0" class="bg-gray-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-gray-800 mb-1">Plesovi i pjesme</h4>
                            <ul class="text-sm space-y-1">
                                <li v-for="item in relatedCatalogItems" :key="item.id">
                                    <router-link :to="`/katalog/${item.type}/${item.id}`"
                                        class="text-red-600 hover:underline">
                                        {{ item.name }}
                                    </router-link>
                                </li>
                            </ul>
                        </div>

                        <div v-if="relatedTopics.length > 0" class="bg-gray-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-gray-800 mb-1">Teme na forumu</h4>
                            <ul class="text-sm space-y-1">
                                <li v-for="topic in relatedTopics" :key="topic.id">
                                    <router-link :to="`/forum/tema/${topic.id}`" class="text-red-600 hover:underline">
                                        {{ topic.title }}
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="mt-6 flex justify-end">
                    <button @click="$emit('close')" class="btn btn-secondary">Zatvori</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useCatalogStore } from '@/stores/catalog'
import { useForumStore } from '@/stores/forum'
import { format, parseISO } from 'date-fns'
import { hr } from 'date-fns/locale'

const props = defineProps({
    event: {
        type: Object,
        required: true
    }
})

defineEmits(['close'])

const catalogStore = useCatalogStore()
const forumStore = useForumStore()

const relatedCatalogItems = ref([])
const relatedTopics = ref([])

const eventTypeLabel = computed(() => {
    switch (props.event.type) {
        case 'smotra':
            return 'Smotra'
        case 'festival':
            return 'Festival'
        case 'radionica':
            return 'Radionica'
        default:
            return props.event.type
    }
})

const formatDate = (dateString) => {
    if (!dateString) return ''

    try {
        const date = parseISO(dateString)


        if (dateString.includes('T')) {
            return format(date, 'dd.MM.yyyy. HH:mm', { locale: hr })
        } else {
            return format(date, 'dd.MM.yyyy.', { locale: hr })
        }
    } catch (err) {
        console.error('Date formatting error:', err)
        return dateString
    }
}

const addToCalendar = () => {
    const event = props.event
    const startDate = new Date(event.date)
    const endDate = event.endDate ? new Date(event.endDate) : startDate

    const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render')
    googleCalendarUrl.searchParams.append('action', 'TEMPLATE')
    googleCalendarUrl.searchParams.append('text', event.title)
    googleCalendarUrl.searchParams.append('dates',
        `${formatDateForCalendar(startDate)}/${formatDateForCalendar(endDate)}`
    )
    googleCalendarUrl.searchParams.append('location', event.location)
    googleCalendarUrl.searchParams.append('details', event.description)

    window.open(googleCalendarUrl.toString(), '_blank')
}

const formatDateForCalendar = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}${month}${day}T${hours}${minutes}00`
}

const shareEvent = () => {
    if (navigator.share) {
        navigator.share({
            title: props.event.title,
            text: `${props.event.title} - ${props.event.description}`,
            url: window.location.href,
        })
            .catch(err => {
                console.error('Greška kod dijeljenja:', err)
                fallbackShare()
            })
    } else {
        fallbackShare()
    }
}

const fallbackShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
        alert('Link je kopiran u međuspremnik!')
    }).catch(err => {
        console.error('Greška kod kopiranja:', err)
    })
}


const findRelatedContent = async () => {

    const region = getRegionFromLocation(props.event.location)
    if (region) {
        relatedCatalogItems.value = catalogStore.items
            .filter(item => item.region === region)
            .slice(0, 3)
    }


    relatedTopics.value = forumStore.topics
        .filter(topic =>
            topic.title.toLowerCase().includes(props.event.title.toLowerCase()) ||
            (topic.tags && topic.tags.some(tag =>
                tag.toLowerCase().includes(props.event.location.split(',')[0].toLowerCase())
            ))
        )
        .slice(0, 3)
}

const getRegionFromLocation = (location) => {
    const locationMapping = {
        'zagreb': 'srednisnja-hrvatska',
        'split': 'dalmacija',
        'dubrovnik': 'dalmacija',
        'rijeka': 'istra-primorje',
        'osijek': 'slavonija',
        'vinkovci': 'slavonija',
        'đakovo': 'slavonija',
        'sisak': 'srednisnja-hrvatska'
    }

    const city = location.split(',')[0].toLowerCase()
    return locationMapping[city] || null
}

onMounted(() => {
    findRelatedContent()
})
</script>