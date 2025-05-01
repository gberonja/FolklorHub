import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import { useUserStore } from './user'

export const useForumStore = defineStore('forum', () => {
  const topics = ref([])
  const loading = ref(false)
  const error = ref(null)

 
  const fetchTopics = async () => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: fetchError } = await supabase
        .from('forum_topics')
        .select(`
          *,
          profiles:user_id (display_name)
        `)
        .order('created_at', { ascending: false })
      
      if (fetchError) throw fetchError
      
      topics.value = data.map(topic => ({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        author: topic.profiles?.display_name || 'Nepoznati korisnik',
        authorId: topic.user_id,
        createdAt: topic.created_at,
        lastReplyAt: topic.last_reply_at || topic.created_at,
        commentsCount: topic.comments_count || 0,
        tags: topic.tags || []
      }))
    } catch (err) {
      console.error('Error fetching forum topics:', err)
      error.value = err.message
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
        .select(`
          *,
          profiles:user_id (display_name)
        `)
        .eq('id', topicId)
        .single()
      
      if (topicError) throw topicError
      

      const { data: commentsData, error: commentsError } = await supabase
        .from('forum_comments')
        .select(`
          *,
          profiles:user_id (display_name)
        `)
        .eq('topic_id', topicId)
        .order('created_at', { ascending: true })
      
      if (commentsError) throw commentsError
      
      const topic = {
        id: topicData.id,
        title: topicData.title,
        description: topicData.description,
        author: topicData.profiles?.display_name || 'Nepoznati korisnik',
        authorId: topicData.user_id,
        createdAt: topicData.created_at,
        commentsCount: commentsData.length,
        tags: topicData.tags || []
      }
      
      const comments = commentsData.map(comment => ({
        id: comment.id,
        content: comment.content,
        author: comment.profiles?.display_name || 'Nepoznati korisnik',
        authorId: comment.user_id,
        createdAt: comment.created_at,
        likes: comment.likes || 0
      }))
      
      return { topic, comments }
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


  const addComment = async (topicId, content) => {
    try {
      const userStore = useUserStore()
      
      if (!userStore.isAuthenticated) {
        throw new Error('Morate biti prijavljeni za dodavanje komentara')
      }
      
      loading.value = true
      error.value = null
      

      const { data, error: commentError } = await supabase
        .from('forum_comments')
        .insert([{
          topic_id: topicId,
          user_id: userStore.user.id,
          content,
          created_at: new Date().toISOString(),
          likes: 0
        }])
      
      if (commentError) throw commentError
      

      const { error: updateError } = await supabase
        .from('forum_topics')
        .update({
          last_reply_at: new Date().toISOString(),
          comments_count: supabase.rpc('increment_comment_count', { topic_id: topicId })
        })
        .eq('id', topicId)
      
      if (updateError) throw updateError
      
      return { success: true }
    } catch (err) {
      console.error('Error adding comment:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }


  const getUserContent = async (userId) => {
    try {
      loading.value = true
      error.value = null
      
      const { data: userTopics, error: topicsError } = await supabase
        .from('forum_topics')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (topicsError) throw topicsError
      

      const { data: userComments, error: commentsError } = await supabase
        .from('forum_comments')
        .select(`
          *,
          forum_topics (id, title)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (commentsError) throw commentsError
      
      return {
        topics: userTopics.map(topic => ({
          id: topic.id,
          title: topic.title,
          description: topic.description,
          createdAt: topic.created_at,
          commentsCount: topic.comments_count || 0
        })),
        comments: userComments.map(comment => ({
          id: comment.id,
          topicId: comment.topic_id,
          topicTitle: comment.forum_topics.title,
          content: comment.content,
          createdAt: comment.created_at
        }))
      }
    } catch (err) {
      console.error(`Error fetching user content:`, err)
      error.value = err.message
      return { topics: [], comments: [] }
    } finally {
      loading.value = false
    }
  }


  fetchTopics()

  return {
    topics,
    loading,
    error,
    fetchTopics,
    getTopicWithComments,
    createTopic,
    addComment,
    getUserContent
  }
})