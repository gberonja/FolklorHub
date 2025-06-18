import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import { useUserStore } from './user'

export const useForumStore = defineStore('forum', () => {
  const topics = ref([])
  const comments = ref({}) 
  const loading = ref(false)
  const error = ref(null)

  // Fetch all topics
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
      
      // Fallback test data if no topics found or error occurs
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

  // Get topic with comments
  const getTopicWithComments = async (topicId) => {
    try {
      loading.value = true
      error.value = null
      
      // First try to find in existing topics
      let topic = topics.value.find(t => t.id === topicId)
      
      if (!topic) {
        // If not found, try to fetch from database
        const { data: topicData, error: topicError } = await supabase
          .from('forum_topics')
          .select('*')
          .eq('id', topicId)
          .single()
        
        if (topicError) {
          console.log('Topic not found in database:', topicError)
          return { topic: null, comments: [] }
        }
        
        // Get author name
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
        
        topic = {
          id: topicData.id,
          title: topicData.title,
          description: topicData.description,
          author: authorName,
          authorId: topicData.user_id,
          createdAt: topicData.created_at,
          commentsCount: 0,
          tags: topicData.tags || []
        }
      }
      
      // Fetch comments for this topic
      let topicComments = []
      
      try {
        const { data: commentsData, error: commentsError } = await supabase
          .from('forum_comments')
          .select('*')
          .eq('topic_id', topicId)
          .order('created_at', { ascending: true })
        
        if (commentsError) {
          console.log('No comments found or error:', commentsError)
        } else if (commentsData && commentsData.length > 0) {
          // Get author names for comments
          topicComments = await Promise.all(
            commentsData.map(async (comment) => {
              let authorName = 'Nepoznati korisnik'
              
              if (comment.user_id) {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('display_name')
                  .eq('id', comment.user_id)
                  .single()
                
                if (profile) {
                  authorName = profile.display_name || 'Nepoznati korisnik'
                }
              }
              
              return {
                id: comment.id,
                content: comment.content,
                author: authorName,
                authorId: comment.user_id,
                createdAt: comment.created_at,
                likes: comment.likes || 0,
                isLikedByUser: false // This would need to be fetched separately
              }
            })
          )
        }
      } catch (commentsErr) {
        console.log('Error fetching comments:', commentsErr)
      }
      
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

  // Create new topic
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
      
      // Refresh topics list
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

  // Add comment to topic
   const addComment = async (topicId, content) => {
    try {
      const userStore = useUserStore()
      
      if (!userStore.isAuthenticated) {
        throw new Error('Morate biti prijavljeni za dodavanje komentara')
      }
      
      loading.value = true
      error.value = null
      
      // Dodaj komentar
      const { data, error: createError } = await supabase
        .from('forum_comments')
        .insert([{
          topic_id: topicId,
          user_id: userStore.user.id,
          content: content,
          created_at: new Date().toISOString()
        }])
        .select()
      
      if (createError) throw createError
      
      // Ažuriraj broj komentara u temi
      const { error: updateError } = await supabase
        .from('forum_topics')
        .update({
          comments_count: supabase.sql`comments_count + 1`,
          last_reply_at: new Date().toISOString()
        })
        .eq('id', topicId)
      
      if (updateError) throw updateError
      
      return { success: true, commentId: data[0].id }
    } catch (err) {
      console.error('Error adding comment:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Search topics
  const searchTopics = async (query) => {
    try {
      if (!query.trim()) return []
      
      const searchTerm = query.toLowerCase()
      
      // Search in existing topics first
      const filteredTopics = topics.value.filter(topic =>
        topic.title.toLowerCase().includes(searchTerm) ||
        topic.description.toLowerCase().includes(searchTerm) ||
        (topic.tags && topic.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
      )
      
      return filteredTopics
    } catch (err) {
      console.error('Error searching topics:', err)
      return []
    }
  }

  // Get user content (topics and comments)
const getUserContent = async (userId) => {
    try {
      loading.value = true
      error.value = null
      
      // Dohvati korisničke teme
      const { data: userTopicsData, error: topicsError } = await supabase
        .from('forum_topics')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (topicsError) throw topicsError
      
      // Dohvati korisničke komentare
      const { data: userCommentsData, error: commentsError } = await supabase
        .from('forum_comments')
        .select(`
          *,
          forum_topics!inner(id, title)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (commentsError) throw commentsError
      
      // Formatiraj teme
      const userTopics = userTopicsData.map(topic => ({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        createdAt: topic.created_at,
        commentsCount: topic.comments_count || 0,
        tags: topic.tags || []
      }))
      
      // Formatiraj komentare
      const userComments = userCommentsData.map(comment => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.created_at,
        topicId: comment.topic_id,
        topicTitle: comment.forum_topics?.title || 'Nepoznata tema'
      }))
      
      return {
        topics: userTopics,
        comments: userComments
      }
    } catch (err) {
      console.error('Error fetching user content:', err)
      error.value = err.message
      return {
        topics: [],
        comments: []
      }
    } finally {
      loading.value = false
    }
  }

  // Delete topic
  const deleteTopic = async (topicId) => {
    try {
      const userStore = useUserStore()
      
      if (!userStore.isAuthenticated) {
        throw new Error('Morate biti prijavljeni za brisanje tema')
      }
      
      loading.value = true
      error.value = null
      
      const { error: deleteError } = await supabase
        .from('forum_topics')
        .delete()
        .eq('id', topicId)
        .eq('user_id', userStore.user.id)
      
      if (deleteError) throw deleteError
      
      // Remove from local state
      topics.value = topics.value.filter(topic => topic.id !== topicId)
      
      return { success: true }
    } catch (err) {
      console.error('Error deleting topic:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Toggle comment like
  const toggleCommentLike = async (commentId, topicId) => {
    try {
      // For now, just return success - would need proper like system
      return { success: true }
    } catch (err) {
      console.error('Error toggling comment like:', err)
      return { success: false, error: err.message }
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

  const checkUserLikes = async (topicId) => {
    // Ova metoda će biti implementirana kasnije kad dodamo like funkcionalnost
    return { success: true }
  }

  // Initialize - fetch topics on store creation
  fetchTopics()

  return {
    // State
    topics,
    comments,
    loading,
    error,
    
    // Actions
    fetchTopics,
    getTopicWithComments,
    createTopic,
    addComment,
    deleteTopic,
    searchTopics,
    getUserContent,
    toggleCommentLike,
    debugTopics,
    checkUserLikes
  }
})