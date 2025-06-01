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
        .order('name')
      
      if (fetchError) throw fetchError
      
      items.value = data.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        region: item.region,
        regionName: item.region_name,
        description: item.description,
        mediaUrl: item.media_url,
        videoUrl: item.video_url,
        audioUrl: item.audio_url
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
      
      const item = {
        id: data.id,
        name: data.name,
        type: data.type,
        region: data.region,
        regionName: data.region_name,
        description: data.description,
        mediaUrl: data.media_url,
        videoUrl: data.video_url,
        audioUrl: data.audio_url
      }


      if (!items.value.find(i => i.id === item.id && i.type === item.type)) {
        items.value.push(item)
      }

      return item
    } catch (err) {
      console.error(`Error fetching item ${type}/${id}:`, err)
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }


  const fetchFavorites = async () => {
    if (!userStore.isAuthenticated) {
      favorites.value = []
      return
    }

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
        return { success: true, message: 'Već je u favoritima' }
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
      
      return { success: true, message: 'Dodano u favorite' }
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
      
      return { success: true, message: 'Uklonjeno iz favorita' }
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


  const getItemsByType = (type) => {
    return items.value.filter(item => item.type === type)
  }

 
  const getItemsByRegion = (region) => {
    return items.value.filter(item => item.region === region)
  }


  const searchItems = (query) => {
    if (!query.trim()) return items.value

    const searchTerm = query.toLowerCase()
    return items.value.filter(item =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.regionName.toLowerCase().includes(searchTerm)
    )
  }


  const getStats = computed(() => {
    const totalItems = items.value.length
    const dances = items.value.filter(item => item.type === 'ples').length
    const songs = items.value.filter(item => item.type === 'pjesma').length
    const regions = [...new Set(items.value.map(item => item.region))].length
    const favoriteCount = favorites.value.length

    return {
      totalItems,
      dances,
      songs,
      regions,
      favoriteCount
    }
  })


  const getPopularRegions = computed(() => {
    const regionCounts = {}
    items.value.forEach(item => {
      regionCounts[item.region] = (regionCounts[item.region] || 0) + 1
    })
    
    return Object.entries(regionCounts)
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => b.count - a.count)
  })

  const getRecentItems = (limit = 5) => {
    return items.value.slice(-limit).reverse()
  }

  const getFeaturedItem = (type = null) => {
    let itemsToChoose = items.value
    if (type) {
      itemsToChoose = items.value.filter(item => item.type === type)
    }
    
    if (itemsToChoose.length === 0) return null
    
    const randomIndex = Math.floor(Math.random() * itemsToChoose.length)
    return itemsToChoose[randomIndex]
  }

  
  const clearFavorites = () => {
    favorites.value = []
  }


  const initialize = async () => {
    if (items.value.length === 0) {
      await fetchItems()
    }
  }

  initialize()

  return {
    // State
    items,
    favorites,
    loading,
    error,
    
   
    fetchItems,
    getItemById,
    fetchFavorites,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    initialize,
    

    isFavorite,
    getFavoriteItems,
    getItemsByType,
    getItemsByRegion,
    searchItems,
    getStats,
    getPopularRegions,
    getRecentItems,
    getFeaturedItem
  }
})