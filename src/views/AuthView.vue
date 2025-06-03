<template>
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <div class="text-center">
                <h1 class="text-3xl font-serif font-bold text-red-600 mb-2">FolklorHub</h1>
                <h2 class="text-2xl font-bold text-gray-900">
                    {{ isLogin ? 'Prijavite se na svoj račun' : 'Stvorite novi račun' }}
                </h2>
                <p class="mt-2 text-sm text-gray-600">
                    {{ isLogin ? 'Nemate račun?' : 'Već imate račun?' }}
                    <button @click="toggleMode" class="font-medium text-red-600 hover:text-red-500">
                        {{ isLogin ? 'Registrirajte se' : 'Prijavite se' }}
                    </button>
                </p>
            </div>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <!-- Error/Success Messages -->
                <div v-if="successMessage" class="mb-4 p-3 bg-green-100 text-green-700 rounded">
                    {{ successMessage }}
                </div>
                <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {{ error }}
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-6">
                    <!-- Ime i prezime (samo za registraciju) -->
                    <div v-if="!isLogin">
                        <label for="displayName" class="block text-sm font-medium text-gray-700">
                            Ime i prezime
                        </label>
                        <div class="mt-1">
                            <input id="displayName" name="displayName" type="text" v-model="form.displayName" required
                                class="form-input" placeholder="Unesite ime i prezime" />
                        </div>
                    </div>

                    <!-- Email -->
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">
                            Email adresa
                        </label>
                        <div class="mt-1">
                            <input id="email" name="email" type="email" v-model="form.email" autocomplete="email"
                                required class="form-input" placeholder="Unesite email adresu" />
                        </div>
                    </div>

                    <!-- Lozinka -->
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700">
                            Lozinka
                        </label>
                        <div class="mt-1">
                            <input id="password" name="password" type="password" v-model="form.password"
                                autocomplete="current-password" required class="form-input"
                                placeholder="Unesite lozinku" minlength="6" />
                        </div>
                        <p v-if="!isLogin" class="mt-1 text-xs text-gray-500">
                            Lozinka mora imati barem 6 znakova
                        </p>
                    </div>

                    <!-- Potvrda lozinke (samo za registraciju) -->
                    <div v-if="!isLogin">
                        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                            Potvrdi lozinku
                        </label>
                        <div class="mt-1">
                            <input id="confirmPassword" name="confirmPassword" type="password"
                                v-model="form.confirmPassword" required class="form-input"
                                placeholder="Ponovite lozinku" />
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div>
                        <button type="submit" :disabled="loading"
                            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50">
                            <span v-if="loading" class="flex items-center">
                                <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                {{ isLogin ? 'Prijavljujem...' : 'Registriram...' }}
                            </span>
                            <span v-else>
                                {{ isLogin ? 'Prijavite se' : 'Registrirajte se' }}
                            </span>
                        </button>
                    </div>
                </form>

                <!-- Forgot Password Link (samo za login) -->
                <div v-if="isLogin" class="mt-6 text-center">
                    <button @click="showForgotPassword = true" class="text-sm text-red-600 hover:text-red-500">
                        Zaboravili ste lozinku?
                    </button>
                </div>
            </div>
        </div>

        <!-- Forgot Password Modal -->
        <div v-if="showForgotPassword"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 class="text-lg font-semibold mb-4">Zaboravljena lozinka</h3>
                <p class="text-gray-600 mb-4">
                    Unesite email adresu i poslat ćemo vam link za resetiranje lozinke.
                </p>
                <form @submit.prevent="handlePasswordReset">
                    <div class="mb-4">
                        <input type="email" v-model="resetEmail" placeholder="Email adresa" class="form-input w-full"
                            required />
                    </div>
                    <div class="flex justify-end space-x-2">
                        <button type="button" @click="showForgotPassword = false" class="btn btn-secondary">
                            Odustani
                        </button>
                        <button type="submit" class="btn btn-primary" :disabled="loading">
                            Pošalji
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const isLogin = ref(true)
const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const showForgotPassword = ref(false)
const resetEmail = ref('')

const form = ref({
    email: '',
    password: '',
    displayName: '',
    confirmPassword: ''
})

const toggleMode = () => {
    isLogin.value = !isLogin.value
    error.value = ''
    successMessage.value = ''
    resetForm()
}

const resetForm = () => {
    form.value = {
        email: '',
        password: '',
        displayName: '',
        confirmPassword: ''
    }
}

const validateForm = () => {
    if (!isLogin.value && form.value.password !== form.value.confirmPassword) {
        error.value = 'Lozinke se ne podudaraju!'
        return false
    }

    if (form.value.password.length < 6) {
        error.value = 'Lozinka mora imati barem 6 znakova!'
        return false
    }

    return true
}

const handleSubmit = async () => {
    error.value = ''
    successMessage.value = ''

    if (!validateForm()) {
        return
    }

    loading.value = true

    try {
        let result

        if (isLogin.value) {
            result = await userStore.login(form.value.email, form.value.password)
        } else {
            result = await userStore.register(
                form.value.email,
                form.value.password,
                form.value.displayName
            )
        }

        if (result.success) {
            if (result.message) {
                successMessage.value = result.message
            } else {
                const redirectTo = route.query.redirect || '/'
                router.push(redirectTo)
            }
        } else {
            error.value = result.error || 'Došlo je do greške. Pokušajte ponovno.'
        }
    } catch (err) {
        console.error('Auth error:', err)
        error.value = 'Došlo je do greške. Pokušajte ponovno.'
    } finally {
        loading.value = false
    }
}

const handlePasswordReset = async () => {
    if (!resetEmail.value) {
        error.value = 'Molimo unesite email adresu'
        return
    }

    loading.value = true

    try {
        const result = await userStore.sendPasswordReset(resetEmail.value)

        if (result.success) {
            successMessage.value = 'Link za resetiranje lozinke je poslan na vaš email'
            showForgotPassword.value = false
            resetEmail.value = ''
        } else {
            error.value = result.error || 'Greška kod slanja emaila'
        }
    } catch (err) {
        console.error('Password reset error:', err)
        error.value = 'Došlo je do greške'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    if (userStore.isAuthenticated) {
        const redirectTo = route.query.redirect || '/profil'
        router.push(redirectTo)
    }
})
</script>