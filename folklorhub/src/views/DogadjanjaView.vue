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
                  <input
                    id="filter-smotra"
                    type="checkbox"
                    v-model="filters.tipSmotra"
                    class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label for="filter-smotra" class="ml-2 text-gray-700">Smotre</label>
                </div>
                <div class="flex items-center">
                  <input
                    id="filter-festival"
                    type="checkbox"
                    v-model="filters.tipFestival"
                    class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label for="filter-festival" class="ml-2 text-gray-700">Festivali</label>
                </div>
                <div class="flex items-center">
                  <input
                    id="filter-radionica"
                    type="checkbox"
                    v-model="filters.tipRadionica"
                    class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label for="filter-radionica" class="ml-2 text-gray-700">Radionice</label>
                </div>
              </div>
            </div>

            <!-- Lokacija -->
            <div class="mb-4">
              <label for="filter-lokacija" class="block text-gray-700 font-medium mb-2"
                >Lokacija</label
              >
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
        </div>

        <!-- Prikaz događaja -->
        <div class="lg:col-span-3">
          <!-- Pretraživanje -->
          <div class="mb-6">
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Pretraživanje događaja..."
                class="form-input pl-10"
              />
              <div class="absolute left-3 top-3 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Izmjena prikaza -->
          <div class="flex justify-between items-center mb-6">
            <div class="flex items-center space-x-2">
              <button
                @click="viewMode = 'list'"
                class="p-2 rounded-md"
                :class="viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </button>
              <button
                @click="viewMode = 'calendar'"
                class="p-2 rounded-md"
                :class="viewMode === 'calendar' ? 'bg-gray-200' : 'hover:bg-gray-100'"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>

            <p class="text-gray-600">{{ filteredEvents.length }} događaja</p>
          </div>

          <!-- Prikaz liste događanja -->
          <div v-if="viewMode === 'list'" class="space-y-4">
            <div
              v-for="event in filteredEvents"
              :key="event.id"
              class="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
            >
              <div class="flex flex-col md:flex-row">
                <div class="md:w-24 flex-shrink-0 mb-4 md:mb-0">
                  <div class="text-center bg-gray-100 rounded-lg p-2">
                    <div class="text-sm text-gray-600">{{ formatMonth(event.date) }}</div>
                    <div class="text-2xl font-bold">{{ formatDay(event.date) }}</div>
                    <div class="text-sm text-gray-600">{{ formatYear(event.date) }}</div>
                  </div>
                </div>

                <div class="md:ml-6 flex-grow">
                  <div class="flex flex-col md:flex-row md:items-center justify-between">
                    <h3 class="text-xl font-semibold">{{ event.title }}</h3>
                    <span
                      class="inline-block px-2 py-1 text-xs rounded-full text-white mt-2 md:mt-0"
                      :class="{
                        'bg-red-600': event.type === 'smotra',
                        'bg-blue-600': event.type === 'festival',
                        'bg-green-600': event.type === 'radionica',
                      }"
                    >
                      {{ eventTypeLabel(event.type) }}
                    </span>
                  </div>

                  <div class="mt-2 flex items-center text-gray-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{{ event.location }}</span>
                  </div>

                  <p class="mt-3 text-gray-700">{{ event.description }}</p>

                  <div class="mt-4">
                    <button @click="openEventDetails(event)" class="text-blue-600 hover:underline">
                      Više detalja →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Nema događaja -->
            <div
              v-if="filteredEvents.length === 0"
              class="bg-white p-8 rounded-lg shadow text-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-16 w-16 text-gray-400 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button @click="currentMonth" class="px-2 py-1 rounded hover:bg-gray-100 text-sm">
                  Današnji mjesec
                </button>
                <button @click="nextMonth" class="p-1 rounded hover:bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Kalendar -->
            <div class="border-t">
              <div class="grid grid-cols-7 border-b">
                <div
                  v-for="day in ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned']"
                  :key="day"
                  class="py-2 text-center text-sm font-medium text-gray-700"
                >
                  {{ day }}
                </div>
              </div>

              <div class="grid grid-cols-7 gap-px">
                <div
                  v-for="(day, index) in calendarDays"
                  :key="index"
                  class="min-h-[80px] p-2 border-b border-r relative"
                  :class="{
                    'bg-gray-50': !day.isCurrentMonth,
                    'bg-green-50': day.isToday,
                  }"
                >
                  <div class="text-right">
                    <span
                      class="text-sm"
                      :class="{
                        'font-bold': day.isToday,
                        'text-gray-400': !day.isCurrentMonth,
                      }"
                    >
                      {{ day.day }}
                    </span>
                  </div>

                  <div class="mt-1 space-y-1">
                    <div
                      v-for="event in getEventsForDay(day.date)"
                      :key="event.id"
                      class="text-xs p-1 rounded truncate cursor-pointer"
                      :class="{
                        'bg-red-600 text-white': event.type === 'smotra',
                        'bg-blue-600 text-white': event.type === 'festival',
                        'bg-green-600 text-white': event.type === 'radionica',
                      }"
                      @click="openEventDetails(event)"
                    >
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
    <div
      v-if="selectedEvent"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div class="p-6">
          <div class="flex justify-between items-start">
            <h2 class="text-2xl font-bold">{{ selectedEvent.title }}</h2>
            <button @click="selectedEvent = null" class="text-gray-400 hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-2 space-y-4">
              <div>
                <span
                  class="inline-block px-2 py-1 text-xs rounded-full text-white"
                  :class="{
                    'bg-red-600': selectedEvent.type === 'smotra',
                    'bg-blue-600': selectedEvent.type === 'festival',
                    'bg-green-600': selectedEvent.type === 'radionica',
                  }"
                >
                  {{ eventTypeLabel(selectedEvent.type) }}
                </span>
              </div>

              <p class="text-gray-700">{{ selectedEvent.description }}</p>

              <div class="space-y-2">
                <div class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{{ formatDate(selectedEvent.date) }}</span>
                </div>

                <div class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{{ selectedEvent.location }}</span>
                </div>

                <div v-if="selectedEvent.organizer" class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>Organizator: {{ selectedEvent.organizer }}</span>
                </div>
              </div>
            </div>

            <div class="md:col-span-1">
              <div class="bg-gray-100 p-4 rounded-lg">
                <h3 class="font-semibold text-lg mb-2">Info</h3>
                <div v-if="selectedEvent.website" class="mb-2">
                  <a
                    :href="selectedEvent.website"
                    target="_blank"
                    class="text-blue-600 hover:underline flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    Web stranica
                  </a>
                </div>
                <div v-if="selectedEvent.email" class="mb-2">
                  <a
                    :href="`mailto:${selectedEvent.email}`"
                    class="text-blue-600 hover:underline flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Email
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button @click="selectedEvent = null" class="btn btn-secondary">Zatvori</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
export default {
  name: 'DogadjanjaView',
  data() {
    return {
      searchQuery: '',
      filters: {
        tipSmotra: true,
        tipFestival: true,
        tipRadionica: true,
        lokacija: '',
        timeRange: 'upcoming',
      },
      viewMode: 'list',
      currentDate: new Date(),
      selectedEvent: null,

      // Dummy podaci za događanja
      events: [
        {
          id: '1',
          title: 'Međunarodna smotra folklora',
          type: 'smotra',
          date: '2025-07-15',
          endDate: '2025-07-20',
          location: 'Zagreb',
          description:
            'Najveća i najvažnija smotra folklornog stvaralaštva u Hrvatskoj s preko 50 godina tradicije.',
          organizer: 'Koncertna direkcija Zagreb',
          website: 'https://www.msf.hr',
          email: 'info@msf.hr',
        },
        {
          id: '2',
          title: 'Đakovački vezovi',
          type: 'festival',
          date: '2025-06-28',
          endDate: '2025-07-06',
          location: 'Đakovo',
          description:
            'Tradicionalna folklorna manifestacija s dugom tradicijom koja predstavlja narodne običaje Slavonije, Baranje i Srijema.',
          organizer: 'Grad Đakovo',
          website: 'https://www.djakovacki-vezovi.hr',
          email: 'info@djakovacki-vezovi.hr',
        },
        {
          id: '3',
          title: 'Radionica tradicijskih plesova Dalmacije',
          type: 'radionica',
          date: '2025-05-15',
          endDate: '2025-05-17',
          location: 'Split',
          description:
            'Trodnevna radionica posvećena učenju tradicijskih plesova dalmatinske regije.',
          organizer: 'KUD Jedinstvo',
          email: 'radionice@kud-jedinstvo.hr',
        },
      ],
    }
  },
  computed: {
    filteredEvents() {
      let result = this.events

      // Filtriranje po tipu
      const types = []
      if (this.filters.tipSmotra) types.push('smotra')
      if (this.filters.tipFestival) types.push('festival')
      if (this.filters.tipRadionica) types.push('radionica')

      if (types.length > 0) {
        result = result.filter((event) => types.includes(event.type))
      }

      // Filtriranje po lokaciji
      if (this.filters.lokacija) {
        result = result.filter((event) =>
          event.location.toLowerCase().includes(this.filters.lokacija.toLowerCase())
        )
      }

      // Filtriranje po vremenskom rasponu
      const today = new Date()
      if (this.filters.timeRange === 'upcoming') {
        result = result.filter((event) => new Date(event.date) >= today)
      } else if (this.filters.timeRange === 'this-month') {
        const thisMonth = today.getMonth()
        const thisYear = today.getFullYear()
        result = result.filter((event) => {
          const eventDate = new Date(event.date)
          return eventDate.getMonth() === thisMonth && eventDate.getFullYear() === thisYear
        })
      } else if (this.filters.timeRange === 'next-month') {
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
        result = result.filter((event) => {
          const eventDate = new Date(event.date)
          return (
            eventDate.getMonth() === nextMonth.getMonth() &&
            eventDate.getFullYear() === nextMonth.getFullYear()
          )
        })
      }

      // Pretraživanje
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(
          (event) =>
            event.title.toLowerCase().includes(query) ||
            event.description.toLowerCase().includes(query) ||
            event.location.toLowerCase().includes(query)
        )
      }

      // Sortiranje po datumu
      result.sort((a, b) => new Date(a.date) - new Date(b.date))

      return result
    },
    currentMonthName() {
      const months = [
        'Siječanj',
        'Veljača',
        'Ožujak',
        'Travanj',
        'Svibanj',
        'Lipanj',
        'Srpanj',
        'Kolovoz',
        'Rujan',
        'Listopad',
        'Studeni',
        'Prosinac',
      ]
      return months[this.currentDate.getMonth()]
    },
    currentYear() {
      return this.currentDate.getFullYear()
    },
    calendarDays() {
      const year = this.currentDate.getFullYear()
      const month = this.currentDate.getMonth()

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
    },
  },
  methods: {
    resetFilters() {
      this.searchQuery = ''
      this.filters = {
        tipSmotra: true,
        tipFestival: true,
        tipRadionica: true,
        lokacija: '',
        timeRange: 'upcoming',
      }
    },
    openEventDetails(event) {
      this.selectedEvent = event
    },
    previousMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() - 1,
        1
      )
    },
    nextMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        1
      )
    },
    currentMonth() {
      this.currentDate = new Date()
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      return `${day}.${month}.${year}.`
    },
    formatDay(dateString) {
      return new Date(dateString).getDate()
    },
    formatMonth(dateString) {
      const months = [
        'Sij',
        'Velj',
        'Ožu',
        'Tra',
        'Svi',
        'Lip',
        'Srp',
        'Kol',
        'Ruj',
        'Lis',
        'Stu',
        'Pro',
      ]
      return months[new Date(dateString).getMonth()]
    },
    formatYear(dateString) {
      return new Date(dateString).getFullYear()
    },
    eventTypeLabel(type) {
      switch (type) {
        case 'smotra':
          return 'Smotra'
        case 'festival':
          return 'Festival'
        case 'radionica':
          return 'Radionica'
        default:
          return type
      }
    },
    getEventsForDay(dateString) {
      return this.events.filter((event) => {
        const eventDate = new Date(event.date)
        const day = eventDate.getDate()
        const month = eventDate.getMonth() + 1
        const year = eventDate.getFullYear()
        const formattedEventDate = `${year}-${String(month).padStart(2, '0')}-${String(
          day
        ).padStart(2, '0')}`
        return formattedEventDate === dateString
      })
    },
  },
}
</script>