<template>
  <div class="py-8">
    <div class="container mx-auto px-4">
      <!-- Breadcrumb navigacija -->
      <div class="mb-6">
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2">
            <li>
              <router-link to="/" class="text-gray-500 hover:text-gray-700">Početna</router-link>
            </li>
            <li>
              <span class="text-gray-500 mx-2">/</span>
              <router-link to="/forum" class="text-gray-500 hover:text-gray-700">Forum</router-link>
            </li>
            <li v-if="topic">
              <span class="text-gray-500 mx-2">/</span>
              <span class="text-gray-900">{{ topic.title }}</span>
            </li>
          </ol>
        </nav>
      </div>

      <!-- Tema i komentari -->
      <div v-if="loading" class="flex justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
      </div>

      <div v-else-if="topic">
        <!-- Topic header -->
        <div class="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <div class="flex flex-col md:flex-row justify-between md:items-start">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ topic.title }}</h1>
                <div class="flex flex-wrap mt-2 gap-2">
                  <span v-for="tag in topic.tags" :key="tag"
                    class="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                    {{ tag }}
                  </span>
                </div>
              </div>
              <div class="mt-4 md:mt-0 flex gap-2">
                <button @click="shareThread" class="btn btn-secondary flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  Podijeli
                </button>

                <button v-if="isTopicAuthor" @click="showDeleteModal = true"
                  class="btn flex items-center justify-center bg-red-600 text-white hover:bg-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clip-rule="evenodd" />
                  </svg>
                  Obriši
                </button>
              </div>
            </div>

            <div class="flex flex-wrap items-center text-sm text-gray-500 mt-3">
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
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <span>{{ comments.length }} odgovora</span>
              </div>
            </div>
          </div>

          <!-- Topic content -->
          <div class="p-6">
            <div class="flex items-start">
              <div class="flex-shrink-0 mr-4">
                <div class="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                  {{ getInitials(topic.author) }}
                </div>
              </div>
              <div class="flex-grow">
                <p class="text-gray-800 whitespace-pre-line">{{ topic.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Comments section -->
        <div class="mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Odgovori ({{ comments.length }})</h2>

          <!-- Comment list -->
          <div v-if="comments.length > 0" class="space-y-4">
            <ForumComment v-for="comment in comments" :key="comment.id" :comment="comment"
              :show-options="isCommentAuthor(comment)" @like="toggleLike" @reply="replyToComment"
              @delete="deleteCommentPrompt" />
          </div>

          <!-- No comments yet -->
          <div v-else class="bg-white p-8 rounded-lg shadow text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 class="text-xl font-semibold mb-2">Još nema odgovora</h3>
            <p class="text-gray-600 mb-4">Budite prvi koji će odgovoriti na ovu temu!</p>
          </div>
        </div>

        <!-- New comment form -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Dodaj odgovor</h2>

          <div v-if="!userStore.isAuthenticated" class="text-center py-4">
            <p class="text-gray-600 mb-3">Morate biti prijavljeni za dodavanje odgovora.</p>
            <router-link :to="`/prijava?redirect=/forum/tema/${topicId}`" class="btn btn-primary">
              Prijavi se
            </router-link>
          </div>

          <form v-else @submit.prevent="addComment">
            <div class="mb-4">
              <textarea v-model="newComment" rows="4" class="form-input" placeholder="Napišite svoj odgovor..."
                required></textarea>
            </div>

            <div v-if="commentError" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {{ commentError }}
            </div>

            <div class="flex justify-end">
              <button type="submit" class="btn btn-primary" :disabled="commenting">
                <span v-if="commenting" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  Objavljuje se...
                </span>
                <span v-else>Objavi odgovor</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Topic not found -->
      <div v-else class="bg-white p-8 rounded-lg shadow text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-red-600 mx-auto mb-4" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-2xl font-bold mb-2">Tema nije pronađena</h2>
        <p class="text-gray-600 mb-4">Nažalost, tražena tema nije pronađena ili je uklonjena.</p>
        <router-link to="/forum" class="btn btn-primary"> Povratak na forum </router-link>
      </div>
    </div>

    <!-- Confirmation modal za brisanje teme -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">Brisanje teme</h3>
        <p class="text-gray-600 mb-6">
          Jeste li sigurni da želite obrisati ovu temu? Ova akcija je nepovratna i izbrisat će sve komentare na temu.
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="showDeleteModal = false" class="btn btn-secondary">
            Odustani
          </button>
          <button @click="deleteTopic" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Izbriši temu
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation modal za brisanje komentara -->
    <div v-if="commentToDelete" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">Brisanje komentara</h3>
        <p class="text-gray-600 mb-6">
          Jeste li sigurni da želite obrisati ovaj komentar? Ova akcija je nepovratna.
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="commentToDelete = null" class="btn btn-secondary">
            Odustani
          </button>
          <button @click="deleteComment" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Izbriši komentar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForumStore } from '@/stores/forum'
import { useUserStore } from '@/stores/user'
import { format, parseISO } from 'date-fns'
import { hr } from 'date-fns/locale'
import ForumComment from '@/components/forum/ForumComment.vue'

const route = useRoute()
const router = useRouter()
const forumStore = useForumStore()
const userStore = useUserStore()

const topicId = computed(() => route.params.id)
const topic = ref(null)
const comments = ref([])
const loading = ref(true)
const newComment = ref('')
const commentError = ref('')
const commenting = ref(false)
const replyToCommentId = ref(null)
const showDeleteModal = ref(false)
const commentToDelete = ref(null)


const isTopicAuthor = computed(() => {
  return userStore.isAuthenticated && topic.value && topic.value.authorId === userStore.user.id
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

const getInitials = (name) => {
  if (!name) return ''

  const names = name.split(' ')
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase()
  }
  return names[0][0].toUpperCase()
}

const isCommentAuthor = (comment) => {
  return userStore.isAuthenticated && comment.authorId === userStore.user.id
}

const addComment = async () => {
  if (!userStore.isAuthenticated) {
    router.push(`/prijava?redirect=/forum/tema/${topicId.value}`)
    return
  }

  if (!newComment.value.trim()) {
    return
  }

  try {
    commenting.value = true
    commentError.value = ''


    let content = newComment.value
    if (replyToCommentId.value) {
      const replyComment = comments.value.find((c) => c.id === replyToCommentId.value)
      if (replyComment) {
        content = `@${replyComment.author}: ${content}`
      }
    }

    const result = await forumStore.addComment(topicId.value, content)

    if (result.success) {
      newComment.value = ''
      replyToCommentId.value = null


      await fetchTopicData()
    } else {
      commentError.value = result.error || 'Greška prilikom dodavanja komentara. Pokušajte ponovno.'
    }
  } catch (error) {
    console.error('Error adding comment:', error)
    commentError.value = 'Došlo je do greške. Pokušajte ponovno kasnije.'
  } finally {
    commenting.value = false
  }
}

const toggleLike = async (commentId) => {
  if (!userStore.isAuthenticated) {
    router.push(`/prijava?redirect=/forum/tema/${topicId.value}`)
    return
  }

  try {
    const result = await forumStore.toggleCommentLike(commentId, topicId.value)

    if (!result.success) {
      console.error('Error toggling like:', result.error)
    }
  } catch (error) {
    console.error('Error toggling like:', error)
  }
}

const replyToComment = (comment) => {
  replyToCommentId.value = comment.id
  newComment.value = `@${comment.author}: `
  document.querySelector('textarea').scrollIntoView({ behavior: 'smooth' })
  document.querySelector('textarea').focus()
}

const shareThread = () => {
  if (navigator.share) {
    navigator.share({
      title: topic.value.title,
      text: `${topic.value.title} - FolklorHub forum`,
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

const deleteTopic = async () => {
  if (!isTopicAuthor.value) {
    return
  }

  try {
    loading.value = true


    const result = await supabase
      .from('forum_topics')
      .delete()
      .eq('id', topicId.value)
      .eq('user_id', userStore.user.id)

    if (result.error) throw result.error

    router.push('/forum')
  } catch (error) {
    console.error('Error deleting topic:', error)
    alert('Greška prilikom brisanja teme. Pokušajte ponovno.')
  } finally {
    loading.value = false
    showDeleteModal.value = false
  }
}

const deleteCommentPrompt = (comment) => {
  commentToDelete = ref(comment)
}

const deleteComment = async () => {
  if (!commentToDelete.value || !isCommentAuthor(commentToDelete.value)) {
    commentToDelete.value = null
    return
  }

  try {
    loading.value = true


    const result = await supabase
      .from('forum_comments')
      .delete()
      .eq('id', commentToDelete.value.id)
      .eq('user_id', userStore.user.id)

    if (result.error) throw result.error


    const updateResult = await supabase
      .from('forum_topics')
      .update({
        comments_count: topic.value.commentsCount - 1
      })
      .eq('id', topicId.value)

    if (updateResult.error) throw updateResult.error


    await fetchTopicData()
  } catch (error) {
    console.error('Error deleting comment:', error)
    alert('Greška prilikom brisanja komentara. Pokušajte ponovno.')
  } finally {
    loading.value = false
    commentToDelete.value = null
  }
}

const fetchTopicData = async () => {
  try {
    loading.value = true

    const { topic: fetchedTopic, comments: fetchedComments } = await forumStore.getTopicWithComments(topicId.value)

    topic.value = fetchedTopic
    comments.value = fetchedComments


    if (userStore.isAuthenticated) {
      await forumStore.checkUserLikes(topicId.value)
    }
  } catch (error) {
    console.error('Error fetching topic:', error)
  } finally {
    loading.value = false
  }
}


onMounted(() => {
  fetchTopicData()
})
</script>