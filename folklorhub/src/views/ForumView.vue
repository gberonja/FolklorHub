<template>
  <div class="py-8">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Forum za diskusiju</h1>
        <button @click="showNewTopicModal = true" class="btn btn-primary flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Nova tema
        </button>
      </div>

      <!-- Pretraživanje i filteri -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Pretraživanje -->
          <div class="md:col-span-2">
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Pretraživanje tema..."
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

          <!-- Sortiranje -->
          <div>
            <select v-model="sortBy" class="form-input">
              <option value="newest">Najnovije teme</option>
              <option value="oldest">Najstarije teme</option>
              <option value="most-commented">Najviše komentara</option>
              <option value="recently-commented">Nedavno komentirano</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Lista tema -->
      <div v-if="filteredTopics.length > 0" class="space-y-4">
        <div
          v-for="topic in filteredTopics"
          :key="topic.id"
          class="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
        >
          <div class="p-6">
            <div class="flex justify-between items-start">
              <div>
                <router-link
                  :to="`/forum/tema/${topic.id}`"
                  class="text-xl font-semibold text-red-600 hover:underline"
                >
                  {{ topic.title }}
                </router-link>
                <p class="mt-2 text-gray-600 line-clamp-2">
                  {{ topic.description }}
                </p>
              </div>
              <div
                class="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-3 text-center"
              >
                <span class="text-2xl font-bold text-gray-700">{{ topic.commentsCount }}</span>
                <span class="text-xs text-gray-500">odgovora</span>
              </div>
            </div>

            <div class="mt-4 flex flex-wrap items-center text-sm text-gray-500">
              <div class="flex items-center mr-4">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>{{ topic.author }}</span>
              </div>
              <div class="flex items-center mr-4">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>Kreirano: {{ formatDate(topic.createdAt) }}</span>
              </div>
              <div class="flex items-center">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Zadnji odgovor: {{ formatDate(topic.lastReplyAt) }}</span>
              </div>
            </div>

            <div class="mt-4">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in topic.tags"
                  :key="tag"
                  class="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Nema tema -->
      <div v-else class="bg-white p-8 rounded-lg shadow text-center">
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
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <h3 class="text-xl font-semibold mb-2">Nema tema za prikaz</h3>
        <p class="text-gray-600 mb-4">
          Nije pronađena niti jedna tema koja odgovara vašem pretraživanju.
        </p>
        <button @click="resetSearch" class="btn btn-primary">Resetiraj pretraživanje</button>
      </div>

      <!-- Modal za novu temu -->
      <div
        v-if="showNewTopicModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <div class="p-6">
            <div class="flex justify-between items-start">
              <h2 class="text-2xl font-bold">Nova tema</h2>
              <button @click="showNewTopicModal = false" class="text-gray-400 hover:text-gray-600">
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

            <form @submit.prevent="createNewTopic" class="mt-6">
              <div class="mb-4">
                <label for="title" class="block text-gray-700 font-medium mb-2">Naslov teme</label>
                <input
                  type="text"
                  id="title"
                  v-model="newTopic.title"
                  required
                  class="form-input"
                  placeholder="Unesite naslov teme"
                />
              </div>

              <div class="mb-4">
                <label for="description" class="block text-gray-700 font-medium mb-2">Opis</label>
                <textarea
                  id="description"
                  v-model="newTopic.description"
                  required
                  rows="5"
                  class="form-input"
                  placeholder="Opišite temu detaljnije..."
                ></textarea>
              </div>

              <div class="mb-6">
                <label for="tags" class="block text-gray-700 font-medium mb-2"
                  >Oznake (odvojene zarezom)</label
                >
                <input
                  type="text"
                  id="tags"
                  v-model="newTopic.tags"
                  class="form-input"
                  placeholder="npr. ples, nošnja, radionica"
                />
              </div>

              <div class="flex justify-end space-x-2">
                <button type="button" @click="showNewTopicModal = false" class="btn btn-secondary">
                  Odustani
                </button>
                <button type="submit" class="btn btn-primary">Objavi temu</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
export default {
  name: 'ForumView',
  data() {
    return {
      searchQuery: '',
      sortBy: 'newest',
      showNewTopicModal: false,

      newTopic: {
        title: '',
        description: '',
        tags: '',
      },

      // Dummy podaci za teme
      topics: [
        {
          id: '1',
          title: 'Pomoć oko koraka za Linđo',
          description:
            'Pozdrav svima! Nedavno sam se pridružio/la folklornom ansamblu i učim plesati Linđo. Imam problem s nekim koracima i bilo bi mi drago da mi netko može pomoći s tim...',
          author: 'Ana Horvat',
          createdAt: '2025-05-10T14:30:00',
          lastReplyAt: '2025-05-11T09:15:00',
          commentsCount: 5,
          tags: ['ples', 'linđo', 'koraci', 'pomoć'],
        },
        {
          id: '2',
          title: 'Gdje nabaviti narodne nošnje?',
          description:
            'Tražim kvalitetne narodne nošnje za naš folklorni ansambl. Znate li gdje se mogu kupiti ili naručiti kvalitetne narodne nošnje, posebno za slavonsku regiju?',
          author: 'Marko Kovačić',
          createdAt: '2025-05-05T10:45:00',
          lastReplyAt: '2025-05-09T16:20:00',
          commentsCount: 8,
          tags: ['nošnje', 'nabava', 'slavonija'],
        },
        {
          id: '3',
          title: 'Detalji o smotri u Slavonskom Brodu',
          description:
            'Zanima me ima li netko više informacija o nadolazećoj smotri folklora u Slavonskom Brodu? Kada počinje prijava, i koji je program?',
          author: 'Ivan Petrović',
          createdAt: '2025-05-01T09:00:00',
          lastReplyAt: '2025-05-03T11:30:00',
          commentsCount: 3,
          tags: ['smotra', 'slavonski brod', 'događaj'],
        },
      ],
    }
  },
  computed: {
    filteredTopics() {
      let result = this.topics

      // Pretraživanje
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(
          (topic) =>
            topic.title.toLowerCase().includes(query) ||
            topic.description.toLowerCase().includes(query) ||
            topic.tags.some((tag) => tag.toLowerCase().includes(query))
        )
      }

      // Sortiranje
      switch (this.sortBy) {
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          break
        case 'oldest':
          result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          break
        case 'most-commented':
          result.sort((a, b) => b.commentsCount - a.commentsCount)
          break
        case 'recently-commented':
          result.sort((a, b) => new Date(b.lastReplyAt) - new Date(a.lastReplyAt))
          break
      }

      return result
    },
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('hr-HR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    resetSearch() {
      this.searchQuery = ''
      this.sortBy = 'newest'
    },

    viewTopic(id) {
      this.$router.push(`/forum/tema/${id}`)
    },

    createNewTopic() {
      const tagsArray = this.newTopic.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag)

      const newTopicData = {
        id: (this.topics.length + 1).toString(),
        title: this.newTopic.title,
        description: this.newTopic.description,
        author: 'Trenutni korisnik', // kasnije dinamički
        createdAt: new Date().toISOString(),
        lastReplyAt: new Date().toISOString(),
        commentsCount: 0,
        tags: tagsArray,
      }

      this.topics.unshift(newTopicData)

      this.newTopic = {
        title: '',
        description: '',
        tags: '',
      }
      this.showNewTopicModal = false
    },
  },
}
</script>