// Community Screen - social features like Android app
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Post, Comment } from '../../types'
import { SocialService } from '../../services/socialService'
import PostCard from './PostCard'
import CreatePostModal from './CreatePostModal'
import './CommunityScreen.css'

const CommunityScreen = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [filter, setFilter] = useState<'ALL' | 'FOLLOWING' | 'ACHIEVEMENTS'>('ALL')

  useEffect(() => {
    loadPosts()
  }, [filter])

  const loadPosts = async () => {
    setIsLoading(true)
    try {
      const loadedPosts = await SocialService.getCommunityPosts(filter, 20)
      setPosts(loadedPosts)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePost = async (content: string, type: string, imageUrl?: string) => {
    if (!user) return

    try {
      const success = await SocialService.createPost(
        user.id,
        content,
        type as any,
        imageUrl
      )
      
      if (success) {
        setIsCreateModalOpen(false)
        await loadPosts() // Refresh posts
      }
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  const handleLikePost = async (postId: string) => {
    if (!user) return

    try {
      await SocialService.likePost(postId, user.id)
      // Update local state
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes.includes(user.id) 
              ? post.likes.filter(id => id !== user.id)
              : [...post.likes, user.id]
            }
          : post
      ))
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleAddComment = async (postId: string, content: string) => {
    if (!user) return

    try {
      const comment = await SocialService.addComment(postId, user.id, content)
      if (comment) {
        // Update local state
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, comments: [...post.comments, comment] }
            : post
        ))
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  return (
    <div className="community-screen">
      <div className="community-header">
        <h1>Community</h1>
        <div className="header-actions">
          <button 
            className="create-post-btn"
            onClick={() => setIsCreateModalOpen(true)}
          >
            ✏️ Share
          </button>
        </div>
      </div>

      <div className="community-filters">
        <button 
          className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilter('ALL')}
        >
          All Posts
        </button>
        <button 
          className={`filter-btn ${filter === 'ACHIEVEMENTS' ? 'active' : ''}`}
          onClick={() => setFilter('ACHIEVEMENTS')}
        >
          🏆 Achievements
        </button>
        <button 
          className={`filter-btn ${filter === 'FOLLOWING' ? 'active' : ''}`}
          onClick={() => setFilter('FOLLOWING')}
        >
          👥 Following
        </button>
      </div>

      <div className="community-content">
        {isLoading ? (
          <div className="loading-posts">
            <div className="loading-spinner"></div>
            <p>Loading community posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-posts">
            <div className="empty-icon">📝</div>
            <h3>No posts yet</h3>
            <p>Be the first to share your wellness journey!</p>
            <button 
              className="create-first-post-btn"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create First Post
            </button>
          </div>
        ) : (
          <div className="posts-list">
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={user?.id || ''}
                onLike={() => handleLikePost(post.id)}
                onComment={(content) => handleAddComment(post.id, content)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {isCreateModalOpen && (
        <CreatePostModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreatePost}
          user={user}
        />
      )}
    </div>
  )
}

export default CommunityScreen