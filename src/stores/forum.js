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
        commentsCount: topicData.comments_count || 0,
        tags: topicData.tags || []
      }
      

      const { data: commentsData, error: commentsError } = await supabase
        .from('forum_comments')
        .select(`
          *,
          profiles(display_name)
        `)
        .eq('topic_id', topicId)
        .order('created_at', { ascending: true })
      
      if (commentsError) throw commentsError
      

      const topicComments = commentsData.map(comment => ({
        id: comment.id,
        content: comment.content,
        author: comment.profiles?.display_name || 'Nepoznati korisnik',
        authorId: comment.user_id,
        createdAt: comment.created_at,
        likes: comment.likes || 0,
        isLikedByUser: false
      }))
      

      const userStore = useUserStore()
      if (userStore.isAuthenticated && topicComments.length > 0) {
        const commentIds = topicComments.map(c => c.id)
        const { data: userLikes } = await supabase
          .from('comment_likes')
          .select('comment_id')
          .eq('user_id', userStore.user.id)
          .in('comment_id', commentIds)
        
        const likedCommentIds = new Set(userLikes?.map(like => like.comment_id) || [])
        
        topicComments.forEach(comment => {
          comment.isLikedByUser = likedCommentIds.has(comment.id)
        })
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
      

      const { data, error: commentError } = await supabase
        .from('forum_comments')
        .insert([{
          topic_id: topicId,
          user_id: userStore.user.id,
          content: content.trim(),
          created_at: new Date().toISOString(),
          likes: 0
        }])
        .select()
      
      if (commentError) throw commentError
      
    
      const { error: updateError } = await supabase
        .from('forum_topics')
        .update({
          last_reply_at: new Date().toISOString()
        })
        .eq('id', topicId)
      
      if (updateError) console.warn('Warning updating topic:', updateError)
      
      return { success: true, commentId: data[0].id }
    } catch (err) {
      console.error('Error adding comment:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }


  const toggleCommentLike = async (commentId, topicId) => {
    try {
      const userStore = useUserStore()
      
      if (!userStore.isAuthenticated) {
        throw new Error('Morate biti prijavljeni za lajkanje komentara')
      }

      const { data: existingLike, error: checkError } = await supabase
        .from('comment_likes')
        .select('*')
        .eq('comment_id', commentId)
        .eq('user_id', userStore.user.id)
        .single()
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError
      }
      
      if (existingLike) {

        const { error: deleteError } = await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', userStore.user.id)
        
        if (deleteError) throw deleteError
        

        const { error: updateError } = await supabase
          .from('forum_comments')
          .update({
            likes: supabase.raw('likes - 1')
          })
          .eq('id', commentId)
        
        if (updateError) throw updateError
      } else {

        const { error: insertError } = await supabase
          .from('comment_likes')
          .insert([{
            comment_id: commentId,
            user_id: userStore.user.id,
            created_at: new Date().toISOString()
          }])
        
        if (insertError) throw insertError
        

        const { error: updateError } = await supabase
          .from('forum_comments')
          .update({
            likes: supabase.raw('likes + 1')
          })
          .eq('id', commentId)
        
        if (updateError) throw updateError
      }
      
      return { success: true }
    } catch (err) {
      console.error('Error toggling comment like:', err)
      return { success: false, error: err.message }
    }
  }


  const getUserContent = async (userId) => {
    try {
      const { data: topicsData, error: topicsError } = await supabase
        .from('forum_topics')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (topicsError) throw topicsError
      

      const { data: commentsData, error: commentsError } = await supabase
        .from('forum_comments')
        .select(`
          *,
          forum_topics(id, title)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (commentsError) throw commentsError
      

      const userTopics = topicsData.map(topic => ({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        createdAt: topic.created_at,
        commentsCount: topic.comments_count || 0,
        tags: topic.tags || []
      }))
      

      const userComments = commentsData.map(comment => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.created_at,
        topicId: comment.topic_id,
        topicTitle: comment.forum_topics?.title || 'Nepoznata tema'
      }))
      
      return { topics: userTopics, comments: userComments }
    } catch (err) {
      console.error('Error fetching user content:', err)
      return { topics: [], comments: [] }
    }
  }


  const searchTopics = async (query) => {
    try {
      const { data, error } = await supabase
        .from('forum_topics')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('last_reply_at', { ascending: false })
      
      if (error) throw error
      

      const topicsWithAuthors = await Promise.all(
        data.map(async (topic) => {
          let authorName = 'Nepoznati korisnik'
          
          if (topic.user_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('display_name')
              .eq('id', topic.user_id)
              .single()
            
            if (profile) {
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
      
      return topicsWithAuthors
    } catch (err) {
      console.error('Error searching topics:', err)
      return []
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
    addComment,
    toggleCommentLike,
    getUserContent,
    searchTopics,
    debugTopics
  }
})