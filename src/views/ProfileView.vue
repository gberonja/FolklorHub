<template>
    <div class="py-8">
        <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto">
                <!-- Header profila -->
                <div class="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
                    <div class="h-32 bg-gradient-to-r from-red-600 to-red-400"></div>
                    <div class="relative px-6 pb-6">
                        <div class="absolute -top-16 left-6">
                            <div class="h-32 w-32 rounded-full border-4 border-white bg-white flex items-center justify-center overflow-hidden relative group cursor-pointer"
                                @click="triggerAvatarUpload">
                                <div v-if="!user.photoURL"
                                    class="h-32 w-32 bg-red-100 flex items-center justify-center">
                                    <span class="text-4xl font-bold text-red-600">{{ userInitials }}</span>
                                </div>
                                <img v-else :src="user.photoURL" alt="Profilna slika"
                                    class="h-full w-full object-cover">

                                <!-- Upload overlay -->
                                <div
                                    class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                            </div>

                            <!-- Hidden file input -->
                            <input ref="avatarInput" type="file" accept="image/*" @change="handleAvatarUpload"
                                class="hidden" />
                        </div>

                        <div class="pt-20">
                            <h1 class="text-2xl font-bold text-gray-900">{{ user.displayName }}</h1>
                            <p class="text-gray-600">{{ user.email }}</p>
                            <p class="text-sm text-gray-500 mt-1">
                                Član od {{ formatDate(user.joinedDate) }}
                            </p>
                            <div v-if="user.bio" class="mt-2">
                                <p class="text-gray-700">{{ user.bio }}</p>
                            </div>
                            <div class="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                                <div v-if="user.location" class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {{ user.location }}
                                </div>
                                <div v-if="user.experience" class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    {{ user.experience }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Navigacija profila -->
                <div class="bg-white rounded-lg shadow mb-6">
                    <div class="border-b border-gray-200">
                        <nav class="flex -mb-px">
                            <button @click="activeTab = 'profile'"
                                :class="{ 'border-red-600 text-red-600': activeTab === 'profile' }"
                                class="px-6 py-3 border-b-2 font-medium text-sm hover:text-red-600 transition-colors">
                                Profil
                            </button>
                            <button @click="activeTab = 'favorites'"
                                :class="{ 'border-red-600 text-red-600': activeTab === 'favorites' }"
                                class="px-6 py-3 border-b-2 font-medium text-sm hover:text-red-600 transition-colors">
                                Favoriti ({{ favoritesCount }})
                            </button>
                            <button @click="activeTab = 'topics'"
                                :class="{ 'border-red-600 text-red-600': activeTab === 'topics' }"
                                class="px-6 py-3 border-b-2 font-medium text-sm hover:text-red-600 transition-colors">
                                Moje teme ({{ userTopics.length }})
                            </button>
                            <button @click="activeTab = 'comments'"
                                :class="{ 'border-red-600 text-red-600': activeTab === 'comments' }"
                                class="px-6 py-3 border-b-2 font-medium text-sm hover:text-red-600 transition-colors">
                                Moji komentari ({{ userComments.length }})
                            </button>
                            <button @click="activeTab = 'settings'"
                                :class="{ 'border-red-600 text-red-600': activeTab === 'settings' }"
                                class="px-6 py-3 border-b-2 font-medium text-sm hover:text-red-600 transition-colors">
                                Postavke
                            </button>
                        </nav>
                    </div>
                </div><!-- Sadržaj ovisno o odabranom tabu -->
                <div class="bg-white rounded-lg shadow p-6">
                    <!-- Profil tab -->
                    <div v-if="activeTab === 'profile'">
                        <h2 class="text-xl font-bold mb-6">Osnovni podaci</h2>

                        <!-- Success/Error messages -->
                        <div v-if="successMessage" class="mb-4 p-3 bg-green-100 text-green-700 rounded">
                            {{ successMessage }}
                        </div>
                        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
                            {{ errorMessage }}
                        </div>

                        <form @submit.prevent="updateProfile">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-gray-700 font-medium mb-2">Ime i prezime</label>
                                    <input type="text" v-model="profileForm.displayName" class="form-input" required />
                                </div>

                                <div>
                                    <label class="block text-gray-700 font-medium mb-2">Email</label>
                                    <input type="email" :value="user.email" class="form-input bg-gray-100" disabled />
                                </div>

                                <div class="md:col-span-2">
                                    <label class="block text-gray-700 font-medium mb-2">O meni</label>
                                    <textarea v-model="profileForm.bio" rows="4" class="form-input"
                                        placeholder="Napišite nešto o sebi..."></textarea>
                                </div>

                                <div>
                                    <label class="block text-gray-700 font-medium mb-2">Lokacija</label>
                                    <input type="text" v-model="profileForm.location" class="form-input"
                                        placeholder="npr. Zagreb, Hrvatska" />
                                </div>

                                <div>
                                    <label class="block text-gray-700 font-medium mb-2">Folklorna iskustva</label>
                                    <input type="text" v-model="profileForm.experience" class="form-input"
                                        placeholder="npr. 5 godina u KUD-u" />
                                </div>
                            </div>

                            <div class="mt-6">
                                <button type="submit" class="btn btn-primary" :disabled="loading">
                                    <span v-if="loading" class="flex items-center">
                                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                            fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                            </path>
                                        </svg>
                                        Spremanje...
                                    </span>
                                    <span v-else>Spremi promjene</span>
                                </button>
                            </div>
                        </form>

                        <!-- Statistike -->
                        <div class="mt-8 pt-8 border-t">
                            <h3 class="text-lg font-semibold mb-4">Statistike aktivnosti</h3>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div class="bg-gray-50 p-4 rounded-lg text-center">
                                    <div class="text-2xl font-bold text-red-600">{{ userTopics.length }}</div>
                                    <div class="text-sm text-gray-600">Kreiranih tema</div>
                                </div>
                                <div class="bg-gray-50 p-4 rounded-lg text-center">
                                    <div class="text-2xl font-bold text-blue-600">{{ userComments.length }}</div>
                                    <div class="text-sm text-gray-600">Objavljenih komentara</div>
                                </div>
                                <div class="bg-gray-50 p-4 rounded-lg text-center">
                                    <div class="text-2xl font-bold text-green-600">{{ favoritesCount }}</div>
                                    <div class="text-sm text-gray-600">Favorita</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Favoriti tab -->
                    <div v-if="activeTab === 'favorites'">
                        <h2 class="text-xl font-bold mb-6">Moji favoriti</h2>
                        <user-favorites :user-id="user.id" @update="handleFavoritesUpdate" />
                    </div>

                    <!-- Moje teme tab -->
                    <div v-if="activeTab === 'topics'">
                        <h2 class="text-xl font-bold mb-6">Moje teme</h2>
                        <div v-if="userTopics.length > 0" class="space-y-4">
                            <div v-for="topic in userTopics" :key="topic.id"
                                class="border rounded-lg p-4 hover:border-red-300 transition-colors">
                                <router-link :to="`/forum/tema/${topic.id}`"
                                    class="text-lg font-semibold text-red-600 hover:underline">
                                    {{ topic.title }}
                                </router-link>
                                <p class="text-gray-600 mt-1 line-clamp-2">{{ topic.description }}</p>
                                <div class="mt-2 flex items-center text-sm text-gray-500">
                                    <span>{{ formatDate(topic.createdAt) }}</span>
                                    <span class="mx-2">•</span>
                                    <span>{{ topic.commentsCount }} odgovora</span>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center py-8 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mx-auto mb-4"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p class="mb-2">Još nemate objavljenih tema.</p>
                            <router-link to="/forum" class="text-red-600 hover:underline">Kreirajte novu temu na
                                forumu!</router-link>
                        </div>
                    </div>

                    <!-- Moji komentari tab -->
                    <div v-if="activeTab === 'comments'">
                        <h2 class="text-xl font-bold mb-6">Moji komentari</h2>
                        <div v-if="userComments.length > 0" class="space-y-4">
                            <div v-for="comment in userComments" :key="comment.id"
                                class="border rounded-lg p-4 hover:border-gray-300 transition-colors">
                                <div class="text-sm text-gray-500 mb-2">
                                    Komentar na temu:
                                    <router-link :to="`/forum/tema/${comment.topicId}`"
                                        class="text-red-600 hover:underline">
                                        {{ comment.topicTitle }}
                                    </router-link>
                                </div>
                                <p class="text-gray-700">{{ comment.content }}</p>
                                <div class="mt-2 text-sm text-gray-500">
                                    {{ formatDate(comment.createdAt) }}
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center py-8 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mx-auto mb-4"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                            </svg>
                            <p class="mb-2">Još nemate komentara.</p>
                            <router-link to="/forum" class="text-red-600 hover:underline">Pridružite se diskusiji na
                                forumu!</router-link>
                        </div>
                    </div><!-- Postavke tab -->
                    <div v-if="activeTab === 'settings'">
                        <h2 class="text-xl font-bold mb-6">Postavke računa</h2>

                        <!-- Promjena lozinke -->
                        <div class="mb-8">
                            <h3 class="text-lg font-semibold mb-4">Promjena lozinke</h3>
                            <form @submit.prevent="changePassword">
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-gray-700 font-medium mb-2">Trenutna lozinka</label>
                                        <input type="password" v-model="passwordForm.currentPassword" class="form-input"
                                            required />
                                    </div>
                                    <div>
                                        <label class="block text-gray-700 font-medium mb-2">Nova lozinka</label>
                                        <input type="password" v-model="passwordForm.newPassword" class="form-input"
                                            required minlength="6" />
                                    </div>
                                    <div>
                                        <label class="block text-gray-700 font-medium mb-2">Potvrdi novu lozinku</label>
                                        <input type="password" v-model="passwordForm.confirmPassword" class="form-input"
                                            required />
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <button type="submit" class="btn btn-primary" :disabled="loading">
                                        <span v-if="loading" class="flex items-center">
                                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    stroke-width="4"></circle>
                                                <path class="opacity-75" fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                                </path>
                                            </svg>
                                            Mijenjam lozinku...
                                        </span>
                                        <span v-else>Promijeni lozinku</span>
                                    </button>
                                </div>
                            </form>
                        </div>

                        <!-- Brisanje računa -->
                        <div class="border-t pt-8">
                            <h3 class="text-lg font-semibold text-red-600 mb-4">Opasna zona</h3>
                            <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                <h4 class="font-semibold text-red-800 mb-2">Brisanje računa</h4>
                                <p class="text-red-700 text-sm mb-4">
                                    Ova radnja je nepovratna. Svi vaši podaci, teme, komentari i favoriti bit će trajno
                                    obrisani.
                                    Nakon brisanja nećete moći oporaviti svoj račun.
                                </p>
                                <button @click="showDeleteModal = true"
                                    class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                                    Obriši račun
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal za potvrdu brisanja računa -->
        <div v-if="showDeleteModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg p-6 max-w-md w-full">
                <div class="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-600 mx-auto mb-4" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <h3 class="text-xl font-bold mb-4">Potvrda brisanja računa</h3>
                    <p class="text-gray-600 mb-6">
                        Jeste li sigurni da želite izbrisati svoj račun? <strong>Ova radnja je nepovratna</strong> i sve
                        vaše
                        podatke, teme, komentare i favorite će biti trajno obrisani.
                    </p>
                    <div class="bg-yellow-50 border border-yellow-200 rounded p-3 mb-6">
                        <p class="text-sm text-yellow-800">
                            Za potvrdu upišite "<strong>OBRIŠI</strong>" u polje ispod:
                        </p>
                        <input type="text" v-model="deleteConfirmation" placeholder="Upišite OBRIŠI"
                            class="form-input mt-2 w-full text-center" />
                    </div>
                </div>
                <div class="flex justify-end space-x-3">
                    <button @click="showDeleteModal = false" class="btn btn-secondary">
                        Odustani
                    </button>
                    <button @click="deleteAccount" :disabled="deleteConfirmation !== 'OBRIŠI'"
                        class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        Izbriši račun
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading overlay za avatar upload -->
        <div v-if="avatarUploading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 text-center">
                <svg class="animate-spin h-8 w-8 text-red-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                <p class="text-gray-700">Učitavam profilnu sliku...</p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useForumStore } from '@/stores/forum'
import { useCatalogStore } from '@/stores/catalog'
import UserFavorites from '@/components/user/UserFavorites.vue'

const router = useRouter()
const userStore = useUserStore()
const forumStore = useForumStore()
const catalogStore = useCatalogStore()

const loading = ref(false)
const avatarUploading = ref(false)
const activeTab = ref('profile')
const showDeleteModal = ref(false)
const deleteConfirmation = ref('')
const successMessage = ref('')
const errorMessage = ref('')

const avatarInput = ref(null)

const user = ref({
    id: '',
    email: '',
    displayName: '',
    bio: '',
    location: '',
    experience: '',
    joinedDate: '',
    photoURL: ''
})

const profileForm = ref({
    displayName: '',
    bio: '',
    location: '',
    experience: ''
})

const passwordForm = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
})

const userTopics = ref([])
const userComments = ref([])

const userInitials = computed(() => {
    if (!user.value.displayName) return 'U';

    const names = user.value.displayName.split(' ');
    if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
})

const favoritesCount = computed(() => {
    return catalogStore.getFavoriteItems.length
})

// Clear messages after timeout
const clearMessages = () => {
    setTimeout(() => {
        successMessage.value = ''
        errorMessage.value = ''
    }, 5000)
}

const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('hr-HR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

const triggerAvatarUpload = () => {
    avatarInput.value?.click()
}

const handleAvatarUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
        avatarUploading.value = true

        const result = await userStore.uploadAvatar(file)

        if (result.success) {
            user.value.photoURL = result.url // Ažuriraj sliku u UI
            successMessage.value = 'Profilna slika uspješno ažurirana!'
            clearMessages()
        } else {
            errorMessage.value = `Greška: ${result.error || 'Nije moguće ažurirati sliku'}`
            clearMessages()
        }
    } catch (err) {
        console.error('Error uploading avatar:', err);
        errorMessage.value = 'Došlo je do greške prilikom učitavanja slike.'
        clearMessages()
    } finally {
        avatarUploading.value = false;
        // Reset input
        if (avatarInput.value) {
            avatarInput.value.value = '';
        }
    }
}

const changePassword = async () => {
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        errorMessage.value = 'Lozinke se ne podudaraju!'
        clearMessages()
        return;
    }

    if (passwordForm.value.newPassword.length < 6) {
        errorMessage.value = 'Nova lozinka mora imati barem 6 znakova!'
        clearMessages()
        return;
    }

    try {
        loading.value = true;
        errorMessage.value = ''
        successMessage.value = ''

        const result = await userStore.changePassword(
            passwordForm.value.currentPassword,
            passwordForm.value.newPassword
        );

        if (result.success) {
            successMessage.value = 'Lozinka uspješno promijenjena!'
            passwordForm.value = {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            };
            clearMessages()
        } else {
            errorMessage.value = `Greška: ${result.error}`
            clearMessages()
        }
    } catch (err) {
        console.error('Error changing password:', err);
        errorMessage.value = 'Došlo je do greške prilikom promjene lozinke.'
        clearMessages()
    } finally {
        loading.value = false;
    }
}

const deleteAccount = async () => {
    if (deleteConfirmation.value !== 'OBRIŠI') {
        return
    }

    try {
        loading.value = true;

        const result = await userStore.deleteAccount();

        if (result.success) {
            router.push('/');
            // Message will be shown after redirect
        } else {
            errorMessage.value = `Greška: ${result.error}`
            clearMessages()
        }
    } catch (err) {
        console.error('Error deleting account:', err);
        errorMessage.value = 'Došlo je do greške prilikom brisanja računa.'
        clearMessages()
    } finally {
        loading.value = false;
        showDeleteModal.value = false;
        deleteConfirmation.value = ''
    }
}

const loadUserData = async () => {
    try {
        if (!userStore.isAuthenticated) {
            router.push('/prijava');
            return;
        }

        user.value = { ...userStore.user };

        profileForm.value = {
            displayName: user.value.displayName || '',
            bio: user.value.bio || '',
            location: user.value.location || '',
            experience: user.value.experience || ''
        };

        // Load user's forum content
        await loadUserContent();

        // Load favorites count
        if (catalogStore.items.length === 0) {
            await catalogStore.fetchItems()
        }
        await catalogStore.fetchFavorites()
    } catch (err) {
        console.error('Error loading user data:', err);
    }
}

const loadUserContent = async () => {
    try {
        loading.value = true;

        const { topics, comments } = await forumStore.getUserContent(user.value.id);

        userTopics.value = topics || [];
        userComments.value = comments || [];
    } catch (err) {
        console.error('Error loading user content:', err);
    } finally {
        loading.value = false;
    }
}

const handleFavoritesUpdate = () => {
    catalogStore.fetchFavorites()
}

const updateProfile = async () => {
    try {
        loading.value = true;
        errorMessage.value = ''
        successMessage.value = ''

        const result = await userStore.updateProfile(profileForm.value);

        if (result.success) {
            user.value = {
                ...user.value,
                ...profileForm.value
            };
            successMessage.value = 'Profil uspješno ažuriran!'
            clearMessages()
        } else {
            errorMessage.value = `Greška: ${result.error || 'Nije moguće ažurirati profil'}`
            clearMessages()
        }
    } catch (err) {
        console.error('Error updating profile:', err);
        errorMessage.value = 'Došlo je do greške prilikom ažuriranja profila.'
        clearMessages()
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    loadUserData();
})


</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
