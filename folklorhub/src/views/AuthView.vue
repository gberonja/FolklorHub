<template>
    <div class="py-12">
      <div class="max-w-md mx-auto px-4">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold">{{ isLogin ? 'Prijava' : 'Registracija' }}</h1>
          <p class="mt-2 text-gray-600">
            {{ isLogin ? 'Dobrodošli natrag! Prijavite se na svoj račun.' : 'Stvorite korisnički račun i postanite dio zajednice.' }}
          </p>
        </div>
  
        <div class="bg-white rounded-lg shadow p-8">
          <!-- Forma za prijavu/registraciju -->
          <form @submit.prevent="submitForm">
            <!-- Email -->
            <div class="mb-6">
              <label for="email" class="block text-gray-700 font-medium mb-2">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="form.email" 
                required 
                class="form-input"
                placeholder="vasa.adresa@example.com" 
              />
            </div>
  
            <!-- Password -->
            <div class="mb-6">
              <label for="password" class="block text-gray-700 font-medium mb-2">Lozinka</label>
              <div class="relative">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="password" 
                  v-model="form.password"
                  required 
                  class="form-input pr-10" 
                  placeholder="******" 
                  minlength="6" 
                />
                <button 
                  type="button" 
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg 
                    v-if="showPassword" 
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
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" 
                    />
                  </svg>
                  <svg 
                    v-else 
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                    <path 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                    />
                  </svg>
                </button>
              </div>
            </div>
  
            <!-- Dodatna polja za registraciju -->
            <div v-if="!isLogin" class="mb-6">
              <label for="confirmPassword" class="block text-gray-700 font-medium mb-2">
                Potvrdi lozinku
              </label>
              <input 
                type="password" 
                id="confirmPassword" 
                v-model="form.confirmPassword" 
                required
                class="form-input" 
                placeholder="******" 
              />
              <p v-if="passwordMismatch" class="mt-1 text-sm text-red-600">
                Lozinke se ne podudaraju
              </p>
            </div>
  
            <div v-if="!isLogin" class="mb-6">
              <label for="displayName" class="block text-gray-700 font-medium mb-2">Ime i prezime</label>
              <input 
                type="text" 
                id="displayName" 
                v-model="form.displayName" 
                required 
                class="form-input"
                placeholder="Vaše ime i prezime" 
              />
            </div>
  
            <!-- Error message -->
            <div v-if="error" class="mb-6 p-3 bg-red-100 text-red-700 rounded">
              {{ error }}
            </div>
  
            <!-- Submit button -->
            <div class="mb-6">
              <button type="submit" class="w-full btn btn-primary py-3" :disabled="loading">
                <span v-if="loading">
                  <svg 
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      class="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path 
                      class="opacity-75" 
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Učitavanje...
                </span>
                <span v-else>
                  {{ isLogin ? 'Prijavi se' : 'Registriraj se' }}
                </span>
              </button>
            </div>
  
            <!-- Toggle between login and register -->
            <div class="text-center">
              <p class="text-gray-600">
                {{ isLogin ? 'Nemate račun?' : 'Već imate račun?' }}
                <button 
                  type="button" 
                  @click="toggleAuthMode"
                  class="text-red-600 hover:underline font-medium"
                >
                  {{ isLogin ? 'Registrirajte se' : 'Prijavite se' }}
                </button>
              </p>
            </div>
  
            <!-- Forgot password -->
            <div v-if="isLogin" class="text-center mt-4">
              <button 
                type="button" 
                class="text-gray-600 hover:text-red-600 transition-colors duration-150"
                @click="forgotPassword"
              >
                Zaboravili ste lozinku?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useUserStore } from '@/stores/user'
  

  const router = useRouter()
  const route = useRoute()
  const userStore = useUserStore()
  

  const isLogin = ref(true)
  const showPassword = ref(false)
  const loading = ref(false)
  const error = ref('')
  
  const form = ref({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  })
  

  const passwordMismatch = computed(() => {
    return !isLogin.value && form.value.password !== form.value.confirmPassword
  })
  

  const toggleAuthMode = () => {
    isLogin.value = !isLogin.value
    error.value = ''
    resetForm()
  }
  
  const resetForm = () => {
    form.value = {
      email: '',
      password: '',
      confirmPassword: '',
      displayName: ''
    }
  }
  
  const forgotPassword = async () => {
    if (!form.value.email) {
      error.value = 'Unesite svoju email adresu za resetiranje lozinke.'
      return
    }
  
    try {
      loading.value = true

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(form.value.email)
      
      if (resetError) throw resetError
      
      alert('Email za resetiranje lozinke je poslan. Provjerite svoju dolaznu poštu.')
    } catch (err) {
      console.error('Password reset error:', err)
      error.value = 'Došlo je do greške prilikom resetiranja lozinke. Pokušajte ponovno.'
    } finally {
      loading.value = false
    }
  }
  
  const submitForm = async () => {
    error.value = ''
  
    if (!isLogin.value && passwordMismatch.value) {
      error.value = 'Lozinke se ne podudaraju'
      return
    }
  
    try {
      loading.value = true
  
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
  
      if (!result.success) {
        throw new Error(result.error || 'Neuspješna autentikacija')
      }
 
      const redirectPath = route.query.redirect || '/'
      router.push(redirectPath)
    } catch (err) {
      console.error('Auth error:', err)
      error.value = err.message || 'Došlo je do pogreške. Molimo pokušajte ponovno.'
    } finally {
      loading.value = false
    }
  }
  

  watch(() => userStore.error, (newError) => {
    if (newError) {
      error.value = newError
    }
  })
  </script>