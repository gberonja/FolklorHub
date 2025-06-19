<template>
  <div class="py-8">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Forum za diskusiju</h1>
        <button @click="showNewTopicModal = true" class="btn btn-primary flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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
              <input type="text" v-model="searchQuery" @input="performSearch" placeholder="Pretraživanje tema..."
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

        <!-- Popularni tagovi -->
        <div class="mt-4" v-if="popularTags.length > 0">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Popularni tagovi</h3>
          <div class="flex flex-wrap gap-2">
            <button v-for="tag in popularTags" :key="tag.name" @click="toggleTagFilter(tag.name)"
              class="px-2 py-1 text-sm rounded-full"
              :class="selectedTags.includes(tag.name) ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'">
              {{ tag.name }} ({{ tag.count }})
            </button>
          </div>
        </div>
      </div>

      <!-- Lista tema -->
      <div v-if="loading" class="flex justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
      </div>

      <div v-else-if="filteredTopics.length > 0" class="space-y-4">
        <ForumTopicCard v-for="topic in filteredTopics" :key="topic.id" :topic="topic" />
      </div>

      <!-- Nema tema -->
      <div v-else class="bg-white p-8 rounded-lg shadow text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h3 class="text-xl font-semibold mb-2">Nema tema za prikaz</h3>
        <p class="text-gray-600 mb-4">
          {{ getNoTopicsMessage() }}
        </p>
        <button @click="resetSearch" class="btn btn-primary">
          {{ searchQuery ? 'Resetiraj pretraživanje' : 'Kreiraj novu temu' }}
        </button>
      </div>

      <!-- Modal za novu temu -->
      <div v-if="showNewTopicModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <div class="p-6">
            <div class="flex justify-between items-start">
              <h2 class="text-2xl font-bold">Nova tema</h2>
              <button @click="closeNewTopicModal" class="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="createNewTopic" class="mt-6">
              <div class="mb-4">
                <label for="title" class="block text-gray-700 font-medium mb-2">Naslov teme</label>
                <input type="text" id="title" v-model="newTopic.title" required class="form-input"
                  placeholder="Unesite naslov teme" />
              </div>

              <div class="mb-4">
                <label for="description" class="block text-gray-700 font-medium mb-2">Opis</label>
                <textarea id="description" v-model="newTopic.description" required rows="5" class="form-input"
                  placeholder="Opišite temu detaljnije..."></textarea>
              </div>

              <div class="mb-6">
                <label for="tags" class="block text-gray-700 font-medium mb-2">Oznake (odvojene zarezom)</label>
                <input type="text" id="tags" v-model="newTopic.tags" class="form-input"
                  placeholder="npr. ples, nošnja, radionica" />
              </div>

              <div v-if="createError" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {{ createError }}
              </div>

              <div class="flex justify-end space-x-2">
                <button type="button" @click="closeNewTopicModal" class="btn btn-secondary">
                  Odustani
                </button>
                <button type="submit" class="btn btn-primary" :disabled="creating">
                  <span v-if="creating" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                      viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                      </path>
                    </svg>
                    Objavljuje se...
                  </span>
                  <span v-else>Objavi temu</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useForumStore } from '@/stores/forum'
import { useUserStore } from '@/stores/user'
import ForumTopicCard from '@/components/forum/ForumTopicCard.vue'

const router = useRouter()
const forumStore = useForumStore()
const userStore = useUserStore()

const searchQuery = ref('')
const sortBy = ref('newest')
const showNewTopicModal = ref(false)
const creating = ref(false)
const createError = ref('')
const selectedTags = ref([])
const searchResults = ref([])
const newTopic = ref({
  title: '',
  description: '',
  tags: ''
})


const loading = computed(() => forumStore.loading)

const filteredTopics = computed(() => {
  let result = searchQuery.value ? searchResults.value : forumStore.topics

  if (selectedTags.value.length > 0) {
    result = result.filter(topic =>
      topic.tags && topic.tags.some(tag =>
        selectedTags.value.includes(tag)
      )
    )
  }


  switch (sortBy.value) {
    case 'newest':
      return [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    case 'oldest':
      return [...result].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    case 'most-commented':
      return [...result].sort((a, b) => b.commentsCount - a.commentsCount)
    case 'recently-commented':
      return [...result].sort((a, b) => new Date(b.lastReplyAt) - new Date(a.lastReplyAt))
    default:
      return result
  }
})

const popularTags = computed(() => {
  const tagCounts = {}
  forumStore.topics.forEach(topic => {
    if (topic.tags && Array.isArray(topic.tags)) {
      topic.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    }
  })


  return Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
})


const getNoTopicsMessage = () => {
  if (searchQuery.value) {
    return 'Nije pronađena niti jedna tema koja odgovara vašem pretraživanju.'
  }
  return 'Trenutno nema tema na forumu.'
}

const resetSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  selectedTags.value = []

  if (!searchQuery.value) {
    showNewTopicModal.value = true
  }
}

const closeNewTopicModal = () => {
  showNewTopicModal.value = false
  createError.value = ''
  newTopic.value = {
    title: '',
    description: '',
    tags: ''
  }
}

const createNewTopic = async () => {
  if (!userStore.isAuthenticated) {
    router.push('/prijava?redirect=/forum')
    return
  }

  try {
    creating.value = true
    createError.value = ''

    const result = await forumStore.createTopic(
      newTopic.value.title,
      newTopic.value.description,
      newTopic.value.tags
    )

    if (result.success) {
      closeNewTopicModal()
      router.push(`/forum/tema/${result.topicId}`)
    } else {
      createError.value = result.error || 'Greška prilikom stvaranja teme. Pokušajte ponovno.'
    }
  } catch (error) {
    console.error('Error creating topic:', error)
    createError.value = 'Došlo je do greške. Pokušajte ponovno kasnije.'
  } finally {
    creating.value = false
  }
}

const toggleTagFilter = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
}

let searchTimeout
const performSearch = () => {
  clearTimeout(searchTimeout)

  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  searchTimeout = setTimeout(async () => {
    try {
      const results = await forumStore.searchTopics(searchQuery.value)
      searchResults.value = results
    } catch (error) {
      console.error('Error searching topics:', error)
    }
  }, 300)
}


onMounted(async () => {
  if (forumStore.topics.length === 0) {
    await forumStore.fetchTopics()
  }
})


watch(sortBy, () => {
})
</script>