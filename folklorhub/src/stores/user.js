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

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError
        }


        if (!data) {
          await createUserProfile(supabaseUser)
          return fetchUser() 
        }

        user.value = {
          id: supabaseUser.id,
          email: supabaseUser.email,
          displayName: data?.display_name || supabaseUser.email.split('@')[0],
          bio: data?.bio || '',
          location: data?.location || '',
          experience: data?.experience || '',
          joinedDate: data?.created_at || supabaseUser.created_at,
          photoURL: data?.avatar_url || '',
          isEmailVerified: supabaseUser.email_confirmed_at !== null
        }
      }
    } catch (err) {
      console.error('Error fetching user:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function createUserProfile(supabaseUser) {
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: supabaseUser.id,
            display_name: supabaseUser.email.split('@')[0],
            avatar_url: '',
            bio: '',
            location: '',
            experience: '',
            created_at: new Date().toISOString()
          }
        ])
      
      if (profileError) throw profileError
    } catch (err) {
      console.error('Error creating user profile:', err)
      throw err
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
      

      if (data.user && !data.session) {

        return { 
          success: true, 
          message: 'Provjerite email za potvrdu registracije.' 
        }
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
      error.value = null
      
      if (!user.value) throw new Error('Korisnik nije prijavljen')
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          display_name: profileData.displayName,
          bio: profileData.bio,
          location: profileData.location,
          experience: profileData.experience,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.value.id)
      
      if (updateError) throw updateError
      
 
      user.value = {
        ...user.value,
        displayName: profileData.displayName,
        bio: profileData.bio,
        location: profileData.location,
        experience: profileData.experience
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

  async function uploadAvatar(file) {
    try {
      loading.value = true
      error.value = null
      
      if (!user.value) throw new Error('Korisnik nije prijavljen')
      

      if (!file.type.startsWith('image/')) {
        throw new Error('Možete uploadati samo slike')
      }
      

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Slika ne smije biti veća od 5MB')
      }
      

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.value.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`
      

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (uploadError) throw uploadError
      

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath)
      

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.value.id)
      
      if (updateError) throw updateError
      

      if (user.value.photoURL) {
        try {
          const oldPath = user.value.photoURL.split('/').pop()
          if (oldPath && oldPath !== fileName) {
            await supabase.storage
              .from('profiles')
              .remove([`avatars/${oldPath}`])
          }
        } catch (err) {
          console.warn('Could not delete old avatar:', err)
        }
      }
      

      user.value.photoURL = publicUrl
      
      return { success: true, url: publicUrl }
    } catch (err) {
      console.error('Avatar upload error:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function changePassword(currentPassword, newPassword) {
    try {
      loading.value = true
      error.value = null
      
      if (!user.value) throw new Error('Korisnik nije prijavljen')
      

      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: user.value.email,
        password: currentPassword
      })
      
      if (reauthError) throw new Error('Trenutna lozinka nije ispravna')
      

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (updateError) throw updateError
      
      return { success: true }
    } catch (err) {
      console.error('Password change error:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function deleteAccount() {
    try {
      loading.value = true
      error.value = null
      
      if (!user.value) throw new Error('Korisnik nije prijavljen')
      
      const userId = user.value.id
      

      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)
      
      if (profileError) throw profileError
      

      if (user.value.photoURL) {
        try {
          const fileName = user.value.photoURL.split('/').pop()
          await supabase.storage
            .from('profiles')
            .remove([`avatars/${fileName}`])
        } catch (err) {
          console.warn('Could not delete avatar:', err)
        }
      }
      
      const { error: deleteError } = await supabase.auth.admin.deleteUser(userId)
      
      
      if (deleteError) {
        console.warn('Could not delete auth user:', deleteError)
      }
      

      await supabase.auth.signOut()
      user.value = null
      
      return { success: true }
    } catch (err) {
      console.error('Account deletion error:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function sendPasswordReset(email) {
    try {
      loading.value = true
      error.value = null
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (resetError) throw resetError
      
      return { success: true }
    } catch (err) {
      console.error('Password reset error:', err)
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
    uploadAvatar,
    changePassword,
    deleteAccount,
    sendPasswordReset,
    fetchUser
  }
})