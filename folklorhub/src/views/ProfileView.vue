<template>
    <div class="py-8">
        <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto">
                <!-- Header profila -->
                <div class="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
                    <div class="h-32 bg-gradient-to-r from-red-600 to-red-400"></div>
                    <div class="relative px-6 pb-6">
                        <div class="absolute -top-16 left-6">
                            <div
                                class="h-32 w-32 rounded-full border-4 border-white bg-white flex items-center justify-center overflow-hidden">
                                <div v-if="!user.photoURL"
                                    class="h-32 w-32 bg-red-100 flex items-center justify-center">
                                    <span class="text-4xl font-bold text-red-600">{{ userInitials }}</span>
                                </div>
                                <img v-else :src="user.photoURL" alt="Profilna slika"
                                    class="h-full w-full object-cover">
                            </div>
                        </div>

                        <div class="pt-20">
                            <h1 class="text-2xl font-bold text-gray-900">{{ user.displayName }}</h1>
                            <p class="text-gray-600">{{ user.email }}</p>
                            <p class="text-sm text-gray-500 mt-1">
                                Član od {{ formatDate(user.joinedDate) }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Navigacija profila -->
                <div class="bg-white rounded-lg shadow mb-6">
                    <div class="border-b border-gray-200">
                        <nav class="flex -mb-px">
                            <button @click="activeTab = 'profile'"
                                :class="{ 'border-red-600 text-red-600': activeTab === 'profile' }"
                                class="px-6 py-3 border-b-2 font-medium text-sm">
                                Profil
                            </button>
                            <button @click="activeTab = 'topics'"
                                :class="{ 'border-red-600 text-red-600': activeTab === 'topics' }"
                                class="px-6 py-3 border-b-2 font-medium text-sm">
                                Moje teme
                            </button>
                            <button @click="activeTab = 'comments'"
                                :class="{ 'border-red-600 text-red-600': activeTab === 'comments' }"
                                class="px-6 py-3 border-b-2 font-medium text-sm">
                                Moji komentari
                            </button>
                            <button @click="activeTab = 'settings'"
                                :class="{ 'border-red-600 text-red-600': activeTab === 'settings' }"
                                class="px-6 py-3 border-b-2 font-medium text-sm">
                                Postavke
                            </button>
                        </nav>
                    </div>
                </div>

                <!-- Sadržaj ovisno o odabranom tabu -->
                <div class="bg-white rounded-lg shadow p-6">
                    <!-- Profil tab -->
                    <div v-if="activeTab === 'profile'">
                        <h2 class="text-xl font-bold mb-6">Osnovni podaci</h2>
                        <form @submit.prevent="updateProfile">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-gray-700 font-medium mb-2">Ime i prezime</label>
                                    <input type="text" v-model="profileForm.displayName" class="form-input" />
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
                            Još nemate objavljenih tema.
                        </div>
                    </div>

                    <!-- Moji komentari tab -->
                    <div v-if="activeTab === 'comments'">
                        <h2 class="text-xl font-bold mb-6">Moji komentari</h2>
                        <div v-if="userComments.length > 0" class="space-y-4">
                            <div v-for="comment in userComments" :key="comment.id" class="border rounded-lg p-4">
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
                            Još nemate komentara.
                        </div>
                    </div>

                    <!-- Postavke tab -->
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
                                    <button type="submit" class="btn btn-primary">
                                        Promijeni lozinku
                                    </button>
                                </div>
                            </form>
                        </div>

                        <!-- Brisanje računa -->
                        <div class="border-t pt-8">
                            <h3 class="text-lg font-semibold text-red-600 mb-4">Brisanje računa</h3>
                            <p class="text-gray-600 mb-4">
                                Ova radnja je nepovratna. Svi vaši podaci, teme i komentari bit će trajno obrisani.
                            </p>
                            <button @click="showDeleteModal = true"
                                class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                                Obriši račun
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal za potvrdu brisanja računa -->
        <div v-if="showDeleteModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 class="text-xl font-bold mb-4">Potvrda brisanja računa</h3>
                <p class="text-gray-600 mb-6">
                    Jeste li sigurni da želite izbrisati svoj račun? Ova radnja je nepovratna.
                </p>
                <div class="flex justify-end space-x-3">
                    <button @click="showDeleteModal = false" class="btn btn-secondary">
                        Odustani
                    </button>
                    <button @click="deleteAccount" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                        Izbriši račun
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProfileView',
    data() {
        return {
            loading: false,
            activeTab: 'profile',
            showDeleteModal: false,

            user: {
                email: '',
                displayName: '',
                bio: '',
                location: '',
                experience: '',
                joinedDate: '',
                photoURL: ''
            },

            profileForm: {
                displayName: '',
                bio: '',
                location: '',
                experience: ''
            },

            passwordForm: {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            },
            
            userTopics: [
                {
                    id: '1',
                    title: 'Pomoć oko koraka za Linđo',
                    description: 'Pozdrav svima! Nedavno sam se pridružio/la folklornom ansamblu i učim plesati Linđo...',
                    createdAt: '2025-05-10T14:30:00',
                    commentsCount: 5
                }
            ],

            userComments: [
                {
                    id: '1',
                    topicId: '2',
                    topicTitle: 'Gdje nabaviti narodne nošnje?',
                    content: 'Preporučujem obrtničku radionicu "Narodno blago" u Osijeku...',
                    createdAt: '2025-05-05T11:20:00'
                }
            ]
        };
    },
    computed: {
        userInitials() {
            if (!this.user.displayName) return '';

            const names = this.user.displayName.split(' ');
            if (names.length >= 2) {
                return (names[0][0] + names[1][0]).toUpperCase();
            }
            return names[0][0].toUpperCase();
        }
    },
    methods: {
        formatDate(dateString) {
            if (!dateString) return '';

            const date = new Date(dateString);
            return date.toLocaleDateString('hr-HR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        },

        updateProfile() {
            this.loading = true;

            setTimeout(() => {
                const userData = {
                    ...this.user,
                    ...this.profileForm
                };

                localStorage.setItem('user', JSON.stringify(userData));
                this.user = userData;

                this.loading = false;
                alert('Profil uspješno ažuriran!');
            }, 1000);
        },

        changePassword() {
            if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
                alert('Lozinke se ne podudaraju!');
                return;
            }

            if (this.passwordForm.newPassword.length < 6) {
                alert('Nova lozinka mora imati barem 6 znakova!');
                return;
            }

            alert('Lozinka uspješno promijenjena!');
            this.passwordForm = {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            };
        },

        deleteAccount() {
            localStorage.removeItem('user');
            this.$router.push('/');
            alert('Račun je uspješno obrisan.');
        },

        loadUserData() {
            const userString = localStorage.getItem('user');
            if (userString) {
                const userData = JSON.parse(userString);
                this.user = {
                    ...this.user,
                    ...userData,
                    joinedDate: userData.joinedDate || new Date().toISOString()
                };


                this.profileForm = {
                    displayName: this.user.displayName || '',
                    bio: this.user.bio || '',
                    location: this.user.location || '',
                    experience: this.user.experience || ''
                };
            }
        }
    },
    mounted() {
        this.loadUserData();
    }
};
</script>