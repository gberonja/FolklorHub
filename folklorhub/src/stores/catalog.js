import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export const useCatalogStore = defineStore('catalog', () => {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

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


  fetchItems()

  return {
    items,
    loading,
    error,
    fetchItems,
    getItemById
  }
})