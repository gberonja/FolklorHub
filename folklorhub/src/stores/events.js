import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export const useEventsStore = defineStore('events', () => {
  const events = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchEvents = async () => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
      
      if (fetchError) throw fetchError
      
      events.value = data.map(event => ({
        id: event.id,
        title: event.title,
        type: event.type,
        date: event.date,
        endDate: event.end_date,
        location: event.location,
        description: event.description,
        organizer: event.organizer,
        website: event.website,
        email: event.email
      }))
    } catch (err) {
      console.error('Error fetching events:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const getEventById = async (id) => {
    try {
      loading.value = true
      error.value = null
      

      const existingEvent = events.value.find(event => event.id === id)
      
      if (existingEvent) {
        return existingEvent
      }

      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()
      
      if (fetchError) throw fetchError
      
      return {
        id: data.id,
        title: data.title,
        type: data.type,
        date: data.date,
        endDate: data.end_date,
        location: data.location,
        description: data.description,
        organizer: data.organizer,
        website: data.website,
        email: data.email
      }
    } catch (err) {
      console.error(`Error fetching event ${id}:`, err)
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  fetchEvents()

  return {
    events,
    loading, 
    error,
    fetchEvents,
    getEventById
  }
})