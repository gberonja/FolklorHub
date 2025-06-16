import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import { useUserStore } from './user'

export const useForumStore = defineStore('forum', () => {
  const topics = ref([])
  const comments = ref({}) 
  const loading = ref(false)
  const error = ref(null)


  const fetchTopics = async () => {
    try {
      loading.value = true
      error.value = null
      
      console.log('Fetching topics from Supabase...')
      

      const { data: topicsData, error: fetchError } = await supabase
        .from('forum_topics')
        .select('*')
        .order('last_reply_at', { ascending: false })
      
      if (fetchError) {
        console.error('Error fetching topics:', fetchError)
        throw fetchError
      }
      
      console.log('Raw topics data:', topicsData)
      

      const topicsWithProfiles = await Promise.all(
        topicsData.map(async (topic) => {
          let authorName = 'Nepoznati korisnik'
          
          if (topic.user_id) {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('display_name')
              .eq('id', topic.user_id)
              .single()
            
            if (!profileError && profile) {
              authorName = profile.display_name || 'Nepoznati korisnik'
            }
          }
          
          return {
            id: topic.id,
            title: topic.title,
            description: topic.description,
            author: authorName,
            authorId: topic.user_id,
            createdAt: topic.created_at,
            lastReplyAt: topic.last_reply_at || topic.created_at,
            commentsCount: topic.comments_count || 0,
            tags: topic.tags || []
          }
        })
      )
      
      topics.value = topicsWithProfiles
      console.log('Processed topics:', topics.value)
      
    } catch (err) {
      console.error('Error fetching forum topics:', err)
      error.value = err.message
      
      if (topics.value.length === 0) {
        topics.value = [
          {
            id: 'test-1',
            title: 'Dobrodošlica u FolklorHub forum',
            description: 'Ovdje možete raspravljati o svim aspektima hrvatske folklorne baštine.',
            author: 'Administrator',
            authorId: 'test-user',
            createdAt: new Date().toISOString(),
            lastReplyAt: new Date().toISOString(),
            commentsCount: 0,
            tags: ['dobrodošlica', 'općenito']
          },
          {
            id: 'test-2',
            title: 'Pitanja o tradicionalnim plesovima',
            description: 'Imate li pitanja o izvođenju tradicionalnih plesova? Pitajte ovdje!',
            author: 'Folklor entuzijast',
            authorId: 'test-user-2',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            lastReplyAt: new Date(Date.now() - 3600000).toISOString(),
            commentsCount: 2,
            tags: ['plesovi', 'pitanja']
          }
        ]
        console.log('Using fallback test data')
      }
    } finally {
      loading.value = false
    }
  }


  const getTopicWithComments = async (topicId) => {
    try {
      loading.value = true
      error.value = null
      

      const { data: topicData, error: topicError } = await supabase
        .from('forum_topics')
        .select('*')
        .eq('id', topicId)
        .single()
      
      if (topicError) throw topicError
      
  
      let authorName = 'Nepoznati korisnik'
      if (topicData.user_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', topicData.user_id)
          .single()
        
        if (profile) {
          authorName = profile.display_name || 'Nepoznati korisnik'
        }
      }
      
      const topic = {
        id: topicData.id,
        title: topicData.title,
        description: topicData.description,
        author: authorName,
        authorId: topicData.user_id,
        createdAt: topicData.created_at,
        commentsCount: 0,
        tags: topicData.tags || []
      }
      

      const topicComments = []
      
      comments.value[topicId] = topicComments
      
      return { topic, comments: topicComments }
    } catch (err) {
      console.error(`Error fetching topic ${topicId}:`, err)
      error.value = err.message
      return { topic: null, comments: [] }
    } finally {
      loading.value = false
    }
  }

  const createTopic = async (title, description, tagsString) => {
    try {
      const userStore = useUserStore()
      
      if (!userStore.isAuthenticated) {
        throw new Error('Morate biti prijavljeni za kreiranje nove teme')
      }
      
      loading.value = true
      error.value = null
      
      const tags = tagsString
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '')
      
      const { data, error: createError } = await supabase
        .from('forum_topics')
        .insert([{
          title,
          description,
          user_id: userStore.user.id,
          tags,
          created_at: new Date().toISOString(),
          last_reply_at: new Date().toISOString(),
          comments_count: 0
        }])
        .select()
      
      if (createError) throw createError
      
    
      await fetchTopics()
      
      return { success: true, topicId: data[0].id }
    } catch (err) {
      console.error('Error creating topic:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

 
  const debugTopics = async () => {
    console.log('=== FORUM DEBUGGING ===')
    console.log('Topics count:', topics.value.length)
    console.log('Topics data:', topics.value)
    console.log('Loading:', loading.value)
    console.log('Error:', error.value)
    

    try {
      const { data, error } = await supabase
        .from('forum_topics')
        .select('count(*)')
      
      console.log('Supabase count result:', data, error)
    } catch (err) {
      console.error('Supabase test error:', err)
    }
  }

  fetchTopics()

  return {
    topics,
    comments,
    loading,
    error,
    fetchTopics,
    getTopicWithComments,
    createTopic,
    debugTopics
  }
})