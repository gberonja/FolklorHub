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
          <div v-if="showOptions" class="relative">
            <button @click.stop="toggleDropdown" class="text-gray-400 hover:text-gray-600 p-1 rounded"
              :class="{ 'bg-gray-100': showDropdown }">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </button>
            <!-- Dropdown -->
            <div v-if="showDropdown"
              class="absolute right-0 top-8 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20"
              @click.stop>
              <div class="py-1">
                <button @click="editComment"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Uredi
                </button>
                <button @click="deleteComment"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Izbriši
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <!-- Prikaz sadržaja komentara -->
          <div v-if="!isEditing">
            <p class="mt-2 text-gray-800 whitespace-pre-line">{{ comment.content }}</p>
          </div>

          <!-- Forma za uređivanje komentara -->
          <div v-else class="mt-2">
            <textarea v-model="editedContent" rows="3" class="form-input w-full"
              placeholder="Uredi svoj komentar..."></textarea>
            <div class="mt-2 flex justify-end space-x-2">
              <button @click="cancelEdit" class="px-3 py-1 rounded text-sm bg-gray-200 hover:bg-gray-300 text-gray-800">
                Odustani
              </button>
              <button @click="saveEdit" class="px-3 py-1 rounded text-sm bg-blue-600 hover:bg-blue-700 text-white">
                Spremi
              </button>
            </div>
          </div>
        </div>

        <div class="mt-3 flex space-x-4">
          <button @click="likeComment" class="text-gray-500 hover:text-gray-700 text-sm flex items-center"
            :class="{ 'text-red-600': comment.isLikedByUser }">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1"
              :fill="comment.isLikedByUser ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            Sviđa mi se <span v-if="comment.likes > 0" class="ml-1">({{ comment.likes }})</span>
          </button>
          <button @click="replyToComment" class="text-gray-500 hover:text-gray-700 text-sm flex items-center">
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { parseISO, format } from 'date-fns'
import { hr } from 'date-fns/locale'
import { supabase } from '@/supabase'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
  showOptions: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['like', 'reply', 'delete', 'edit'])

const userStore = useUserStore()

const showDropdown = ref(false)
const isEditing = ref(false)
const editedContent = ref('')

const userInitials = computed(() => {
  if (!props.comment.author) return 'G'

  const names = props.comment.author.split(' ')
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase()
  }
  return names[0][0].toUpperCase()
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

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
  console.log('Dropdown toggled:', showDropdown.value)
}

const likeComment = () => {
  emit('like', props.comment.id)
}

const replyToComment = () => {
  emit('reply', props.comment)
}

const editComment = () => {
  editedContent.value = props.comment.content
  isEditing.value = true
  showDropdown.value = false
}

const cancelEdit = () => {
  isEditing.value = false
  editedContent.value = ''
}

const saveEdit = async () => {
  if (editedContent.value.trim() === '') {
    return
  }

  try {
    if (!props.showOptions || !userStore.isAuthenticated) {
      return
    }

    const { error } = await supabase
      .from('forum_comments')
      .update({
        content: editedContent.value.trim()
      })
      .eq('id', props.comment.id)
      .eq('user_id', userStore.user.id)

    if (error) throw error

    emit('edit', {
      id: props.comment.id,
      content: editedContent.value.trim()
    })

    props.comment.content = editedContent.value.trim()

    isEditing.value = false
  } catch (error) {
    console.error('Error updating comment:', error)
    alert('Došlo je do greške prilikom ažuriranja komentara.')
  }
}

const deleteComment = () => {
  emit('delete', props.comment)
  showDropdown.value = false
}


const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>