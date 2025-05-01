import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)

  async function fetchUser() {
    try {
      loading.value = true
      const { data: { user: supabaseUser } } = await supabase.auth.getUser()
      
      if (supabaseUser) {
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', supabaseUser.id)
          .single()

        if (profileError) throw profileError

        user.value = {
          id: supabaseUser.id,
          email: supabaseUser.email,
          displayName: data?.display_name || supabaseUser.email.split('@')[0],
          bio: data?.bio || '',
          location: data?.location || '',
          experience: data?.experience || '',
          joinedDate: data?.created_at || new Date().toISOString(),
          photoURL: data?.avatar_url || ''
        }
      }
    } catch (err) {
      console.error('Error fetching user:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function login(email, password) {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (loginError) throw loginError
      
      await fetchUser()
      return { success: true }
    } catch (err) {
      console.error('Login error:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function register(email, password, displayName) {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: registerError } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (registerError) throw registerError
      

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              display_name: displayName,
              avatar_url: '',
              bio: '',
              location: '',
              experience: '',
              created_at: new Date().toISOString()
            }
          ])
        
        if (profileError) throw profileError
      }
      
      await fetchUser()
      return { success: true }
    } catch (err) {
      console.error('Registration error:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      loading.value = true
      const { error: logoutError } = await supabase.auth.signOut()
      
      if (logoutError) throw logoutError
      
      user.value = null
      return { success: true }
    } catch (err) {
      console.error('Logout error:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(profileData) {
    try {
      loading.value = true
      
      if (!user.value) throw new Error('Korisnik nije prijavljen')
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          display_name: profileData.displayName,
          bio: profileData.bio,
          location: profileData.location,
          experience: profileData.experience
        })
        .eq('id', user.value.id)
      
      if (updateError) throw updateError
      
      user.value = {
        ...user.value,
        ...profileData
      }
      
      return { success: true }
    } catch (err) {
      console.error('Profile update error:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }


  fetchUser()

  return { 
    user, 
    loading, 
    error, 
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    fetchUser
  }
})