import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import { useUserStore } from './user'

export const useCatalogStore = defineStore('catalog', () => {
  const items = ref([])
  const favorites = ref([])
  const loading = ref(false)
  const error = ref(null)
  const userStore = useUserStore()

  
  const fetchItems = async () => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: fetchError } = await supabase
        .from('catalog_items')
        .select('*')
      
      if (fetchError) throw fetchError
      
      items.value = data.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        region: item.region,
        regionName: item.region_name,
        description: item.description,
        mediaUrl: item.media_url
      }))

      
      if (userStore.isAuthenticated) {
        await fetchFavorites()
      }
    } catch (err) {
      console.error('Error fetching catalog items:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const getItemById = async (type, id) => {
    try {
      loading.value = true
      error.value = null

      const existingItem = items.value.find(
        item => item.id === id && item.type === type
      )
      
      if (existingItem) {
        return existingItem
      }
      
      const { data, error: fetchError } = await supabase
        .from('catalog_items')
        .select('*')
        .eq('id', id)
        .eq('type', type)
        .single()
      
      if (fetchError) throw fetchError
      
      return {
        id: data.id,
        name: data.name,
        type: data.type,
        region: data.region,
        regionName: data.region_name,
        description: data.description,
        mediaUrl: data.media_url
      }
    } catch (err) {
      console.error(`Error fetching item ${type}/${id}:`, err)
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }


  const fetchFavorites = async () => {
    if (!userStore.isAuthenticated) return

    try {
      const { data, error: favError } = await supabase
        .from('user_favorites')
        .select('item_id, item_type')
        .eq('user_id', userStore.user.id)
      
      if (favError) throw favError
      
      favorites.value = data.map(fav => ({
        itemId: fav.item_id,
        itemType: fav.item_type
      }))
    } catch (err) {
      console.error('Error fetching favorites:', err)
    }
  }

  const addToFavorites = async (itemId, itemType) => {
    if (!userStore.isAuthenticated) {
      return { success: false, error: 'Morate biti prijavljeni za dodavanje favorita' }
    }

    try {
      loading.value = true
      

      const isFavorite = favorites.value.some(
        fav => fav.itemId === itemId && fav.itemType === itemType
      )
      
      if (isFavorite) {
        return { success: true }
      }
      
      const { error: favError } = await supabase
        .from('user_favorites')
        .insert([{
          user_id: userStore.user.id,
          item_id: itemId,
          item_type: itemType,
          created_at: new Date().toISOString()
        }])
      
      if (favError) throw favError
      

      favorites.value.push({ itemId, itemType })
      
      return { success: true }
    } catch (err) {
      console.error('Error adding to favorites:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const removeFromFavorites = async (itemId, itemType) => {
    if (!userStore.isAuthenticated) {
      return { success: false, error: 'Morate biti prijavljeni za uklanjanje favorita' }
    }

    try {
      loading.value = true
      
      const { error: favError } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userStore.user.id)
        .eq('item_id', itemId)
        .eq('item_type', itemType)
      
      if (favError) throw favError
      
    
      favorites.value = favorites.value.filter(
        fav => !(fav.itemId === itemId && fav.itemType === itemType)
      )
      
      return { success: true }
    } catch (err) {
      console.error('Error removing from favorites:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const isFavorite = (itemId, itemType) => {
    return favorites.value.some(
      fav => fav.itemId === itemId && fav.itemType === itemType
    )
  }

  const getFavoriteItems = computed(() => {
    return items.value.filter(item => 
      favorites.value.some(fav => 
        fav.itemId === item.id && fav.itemType === item.type
      )
    )
  })

 
  fetchItems()

  return {
    items,
    favorites,
    loading,
    error,
    fetchItems,
    getItemById,
    fetchFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoriteItems
  }
})