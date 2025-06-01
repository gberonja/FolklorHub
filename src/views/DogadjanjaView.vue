<template>
  <div class="py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Kalendar folklornih događanja</h1>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Filteri -->
        <div class="lg:col-span-1">
          <div class="bg-white p-6 rounded-lg shadow mb-6">
            <h2 class="text-xl font-semibold mb-4">Filteri</h2>

            <!-- Tip događaja -->
            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">Tip događaja</label>
              <div class="space-y-2">
                <div class="flex items-center">
                  <input id="filter-smotra" type="checkbox" v-model="filters.tipSmotra"
                    class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                  <label for="filter-smotra" class="ml-2 text-gray-700">Smotre</label>
                </div>
                <div class="flex items-center">
                  <input id="filter-festival" type="checkbox" v-model="filters.tipFestival"
                    class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                  <label for="filter-festival" class="ml-2 text-gray-700">Festivali</label>
                </div>
                <div class="flex items-center">
                  <input id="filter-radionica" type="checkbox" v-model="filters.tipRadionica"
                    class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                  <label for="filter-radionica" class="ml-2 text-gray-700">Radionice</label>
                </div>
              </div>
            </div>

            <!-- Lokacija -->
            <div class="mb-4">
              <label for="filter-lokacija" class="block text-gray-700 font-medium mb-2">Lokacija</label>
              <select id="filter-lokacija" v-model="filters.lokacija" class="form-input">
                <option value="">Sve lokacije</option>
                <option value="zagreb">Zagreb</option>
                <option value="split">Split</option>
                <option value="rijeka">Rijeka</option>
                <option value="osijek">Osijek</option>
                <option value="dubrovnik">Dubrovnik</option>
              </select>
            </div>

            <!-- Vremenski raspon -->
            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">Vremenski raspon</label>
              <select v-model="filters.timeRange" class="form-input">
                <option value="all">Svi događaji</option>
                <option value="upcoming">Nadolazeći</option>
                <option value="this-month">Ovaj mjesec</option>
                <option value="next-month">Sljedeći mjesec</option>
              </select>
            </div>

            <!-- Gumb za resetiranje -->
            <button @click="resetFilters" class="w-full btn btn-secondary">
              Resetiraj filtere
            </button>
          </div>

          <!-- Popularne lokacije -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-semibold mb-3">Popularne lokacije</h3>
            <div class="flex flex-wrap gap-2">
              <button v-for="(count, location) in popularLocations" :key="location" @click="setLocationFilter(location)"
                class="px-2 py-1 text-sm rounded-full"
                :class="filters.lokacija === location ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'">
                {{ location }} ({{ count }})
              </button>
            </div>
          </div>
        </div>

        <!-- Prikaz događaja -->
        <div class="lg:col-span-3">
          <!-- Pretraživanje -->
          <div class="mb-6">
            <div class="relative">
              <input type="text" v-model="searchQuery" placeholder="Pretraživanje događaja..."
                class="form-input pl-10" />
              <div class="absolute left-3 top-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Izmjena prikaza -->
          <div class="flex justify-between items-center mb-6">
            <div class="flex items-center space-x-2">
              <button @click="viewMode = 'list'" class="p-2 rounded-md"
                :class="viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button @click="viewMode = 'calendar'" class="p-2 rounded-md"
                :class="viewMode === 'calendar' ? 'bg-gray-200' : 'hover:bg-gray-100'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>

            <p class="text-gray-600">{{ filteredEvents.length }} događaja</p>
          </div>

          <!-- Loading stanje -->
          <div v-if="eventsStore.loading" class="flex justify-center py-12">
            <svg class="animate-spin h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
          </div>

          <!-- Prikaz liste događanja -->
          <div v-else-if="viewMode === 'list'" class="space-y-4">
            <EventCard v-for="event in filteredEvents" :key="event.id" :event="event"
              @view-details="openEventDetails" />

            <!-- Nema događaja -->
            <div v-if="filteredEvents.length === 0" class="bg-white p-8 rounded-lg shadow text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="text-xl font-semibold mb-2">Nema događaja</h3>
              <p class="text-gray-600 mb-4">
                Nije pronađen niti jedan događaj koji odgovara vašim filterima.
              </p>
              <button @click="resetFilters" class="btn btn-primary">Resetiraj filtere</button>
            </div>
          </div>

          <!-- Kalendarski prikaz -->
          <div v-if="viewMode === 'calendar'" class="bg-white rounded-lg shadow">
            <div class="p-4 flex items-center justify-between">
              <h2 class="text-lg font-semibold">{{ currentMonthName }} {{ currentYear }}</h2>
              <div class="flex space-x-2">
                <button @click="previousMonth" class="p-1 rounded hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button @click="goToCurrentMonth" class="px-2 py-1 rounded hover:bg-gray-100 text-sm">
                  Danas
                </button>
                <button @click="nextMonth" class="p-1 rounded hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Kalendar -->
            <div class="border-t">
              <div class="grid grid-cols-7 border-b">
                <div v-for="day in ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned']" :key="day"
                  class="py-2 text-center text-sm font-medium text-gray-700">
                  {{ day }}
                </div>
              </div>

              <div class="grid grid-cols-7 gap-px">
                <div v-for="(day, index) in calendarDays" :key="index"
                  class="min-h-[80px] p-2 border-b border-r relative" :class="{
                    'bg-gray-50': !day.isCurrentMonth,
                    'bg-blue-50': day.isToday,
                  }">
                  <div class="text-right">
                    <span class="text-sm" :class="{
                      'font-bold': day.isToday,
                      'text-gray-400': !day.isCurrentMonth,
                    }">
                      {{ day.day }}
                    </span>
                  </div>

                  <div class="mt-1 space-y-1">
                    <div v-for="event in getEventsForDay(day.date)" :key="event.id"
                      class="text-xs p-1 rounded truncate cursor-pointer" :class="{
                        'bg-red-600 text-white': event.type === 'smotra',
                        'bg-blue-600 text-white': event.type === 'festival',
                        'bg-green-600 text-white': event.type === 'radionica',
                      }" @click="openEventDetails(event)">
                      {{ event.title }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal za detalje događaja -->
    <EventDetailModal v-if="selectedEvent" :event="selectedEvent" @close="selectedEvent = null" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useEventsStore } from '@/stores/events'
import EventCard from '@/components/events/EventCard.vue'
import EventDetailModal from '@/components/events/EventDetailModal.vue'
import { format } from 'date-fns'
import { hr } from 'date-fns/locale'

const eventsStore = useEventsStore()

const searchQuery = ref('')
const filters = ref({
  tipSmotra: true,
  tipFestival: true,
  tipRadionica: true,
  lokacija: '',
  timeRange: 'upcoming',
})
const viewMode = ref('list')
const currentDate = ref(new Date())
const selectedEvent = ref(null)


const filteredEvents = computed(() => {
  let result = eventsStore.events


  const types = []
  if (filters.value.tipSmotra) types.push('smotra')
  if (filters.value.tipFestival) types.push('festival')
  if (filters.value.tipRadionica) types.push('radionica')

  if (types.length > 0) {
    result = result.filter((event) => types.includes(event.type))
  }


  if (filters.value.lokacija) {
    result = result.filter((event) =>
      event.location.toLowerCase().includes(filters.value.lokacija.toLowerCase())
    )
  }


  const today = new Date()
  if (filters.value.timeRange === 'upcoming') {
    result = result.filter((event) => new Date(event.date) >= today)
  } else if (filters.value.timeRange === 'this-month') {
    const thisMonth = today.getMonth()
    const thisYear = today.getFullYear()
    result = result.filter((event) => {
      const eventDate = new Date(event.date)
      return eventDate.getMonth() === thisMonth && eventDate.getFullYear() === thisYear
    })
  } else if (filters.value.timeRange === 'next-month') {
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
    result = result.filter((event) => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getMonth() === nextMonth.getMonth() &&
        eventDate.getFullYear() === nextMonth.getFullYear()
      )
    })
  }


  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
    )
  }


  result.sort((a, b) => new Date(a.date) - new Date(b.date))

  return result
})

const popularLocations = computed(() => {
  const locations = {}
  eventsStore.events.forEach((event) => {
    const location = event.location.split(',')[0]
    locations[location] = (locations[location] || 0) + 1
  })
  return locations
})

const currentMonthName = computed(() => {
  return format(currentDate.value, 'LLLL', { locale: hr })
})

const currentYear = computed(() => {
  return currentDate.value.getFullYear()
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)


  let firstDayOfWeek = firstDay.getDay()
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

  const daysInMonth = lastDay.getDate()
  const today = new Date()
  const days = []


  const prevMonth = new Date(year, month, 0)
  const daysInPrevMonth = prevMonth.getDate()

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i
    days.push({
      day,
      date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      isCurrentMonth: false,
      isToday: false,
    })
  }


  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()

    days.push({
      day: i,
      date: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      isCurrentMonth: true,
      isToday,
    })
  }


  const totalDays = Math.ceil(days.length / 7) * 7
  const nextMonthDays = totalDays - days.length

  for (let i = 1; i <= nextMonthDays; i++) {
    days.push({
      day: i,
      date: `${year}-${String(month + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      isCurrentMonth: false,
      isToday: false,
    })
  }

  return days
})


const resetFilters = () => {
  searchQuery.value = ''
  filters.value = {
    tipSmotra: true,
    tipFestival: true,
    tipRadionica: true,
    lokacija: '',
    timeRange: 'upcoming',
  }
}

const setLocationFilter = (location) => {
  filters.value.lokacija = filters.value.lokacija === location ? '' : location
}

const openEventDetails = (event) => {
  selectedEvent.value = event
}

const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  )
}

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  )
}

const goToCurrentMonth = () => {
  currentDate.value = new Date()
}

const getEventsForDay = (dateString) => {
  return filteredEvents.value.filter((event) => {
    const eventDate = new Date(event.date)
    const day = eventDate.getDate()
    const month = eventDate.getMonth() + 1
    const year = eventDate.getFullYear()
    const formattedEventDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return formattedEventDate === dateString
  })
}


onMounted(async () => {
  if (eventsStore.events.length === 0) {
    await eventsStore.fetchEvents()
  }
})
</script>