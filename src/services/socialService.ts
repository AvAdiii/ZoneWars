// Social Service - manages community features and social interactions
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore'
import { db } from './firebase'
import { Post, Comment, User } from '../types'

export class SocialService {
  private static readonly POSTS_COLLECTION = 'posts'
  private static readonly COMMENTS_COLLECTION = 'comments'
  private static readonly USERS_COLLECTION = 'users'

  // Create a new post
  static async createPost(userId: string, content: string, type: 'text' | 'achievement' | 'location' = 'text'): Promise<Post> {
    try {
      const postData = {
        userId,
        content,
        type,
        likes: [],
        commentCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      const docRef = await addDoc(collection(db, this.POSTS_COLLECTION), postData)
      
      return {
        id: docRef.id,
        ...postData,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Post
    } catch (error) {
      console.error('Error creating post:', error)
      throw error
    }
  }

  // Get posts from the community
  static async getPosts(limitCount: number = 20): Promise<Post[]> {
    try {
      const postsQuery = query(
        collection(db, this.POSTS_COLLECTION),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )

      const snapshot = await getDocs(postsQuery)
      const posts: Post[] = []

      snapshot.forEach((doc: any) => {
        const data = doc.data()
        posts.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        })
      })

      return posts
    } catch (error) {
      console.error('Error getting posts:', error)
      throw error
    }
  }

  // Get posts by a specific user
  static async getUserPosts(userId: string): Promise<Post[]> {
    try {
      const postsQuery = query(
        collection(db, this.POSTS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )

      const snapshot = await getDocs(postsQuery)
      const posts: Post[] = []

      snapshot.forEach((doc: any) => {
        const data = doc.data()
        posts.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        })
      })

      return posts
    } catch (error) {
      console.error('Error getting user posts:', error)
      throw error
    }
  }

  // Like or unlike a post
  static async toggleLike(postId: string, userId: string): Promise<void> {
    try {
      const postRef = doc(db, this.POSTS_COLLECTION, postId)
      const postDoc = await getDoc(postRef)
      
      if (!postDoc.exists()) {
        throw new Error('Post not found')
      }

      const postData = postDoc.data()
      const likes = postData.likes || []
      const hasLiked = likes.includes(userId)

      if (hasLiked) {
        // Remove like
        await updateDoc(postRef, {
          likes: arrayRemove(userId),
          updatedAt: serverTimestamp()
        })
      } else {
        // Add like
        await updateDoc(postRef, {
          likes: arrayUnion(userId),
          updatedAt: serverTimestamp()
        })
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      throw error
    }
  }

  // Add a comment to a post
  static async addComment(postId: string, userId: string, content: string): Promise<Comment> {
    try {
      const commentData = {
        postId,
        userId,
        content,
        createdAt: serverTimestamp()
      }

      const docRef = await addDoc(collection(db, this.COMMENTS_COLLECTION), commentData)

      // Update comment count on the post
      const postRef = doc(db, this.POSTS_COLLECTION, postId)
      const postDoc = await getDoc(postRef)
      
      if (postDoc.exists()) {
        const currentCount = postDoc.data().commentCount || 0
        await updateDoc(postRef, {
          commentCount: currentCount + 1,
          updatedAt: serverTimestamp()
        })
      }

      return {
        id: docRef.id,
        ...commentData,
        createdAt: new Date()
      } as Comment
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  }

  // Get comments for a post
  static async getComments(postId: string): Promise<Comment[]> {
    try {
      const commentsQuery = query(
        collection(db, this.COMMENTS_COLLECTION),
        where('postId', '==', postId),
        orderBy('createdAt', 'asc')
      )

      const snapshot = await getDocs(commentsQuery)
      const comments: Comment[] = []

      snapshot.forEach((doc: any) => {
        const data = doc.data()
        comments.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        })
      })

      return comments
    } catch (error) {
      console.error('Error getting comments:', error)
      throw error
    }
  }

  // Delete a post
  static async deletePost(postId: string, userId: string): Promise<void> {
    try {
      const postRef = doc(db, this.POSTS_COLLECTION, postId)
      const postDoc = await getDoc(postRef)
      
      if (!postDoc.exists()) {
        throw new Error('Post not found')
      }

      const postData = postDoc.data()
      if (postData.userId !== userId) {
        throw new Error('Unauthorized to delete this post')
      }

      await deleteDoc(postRef)

      // Also delete all comments for this post
      const commentsQuery = query(
        collection(db, this.COMMENTS_COLLECTION),
        where('postId', '==', postId)
      )
      
      const commentsSnapshot = await getDocs(commentsQuery)
      const deletePromises = commentsSnapshot.docs.map(doc => deleteDoc(doc.ref))
      await Promise.all(deletePromises)
    } catch (error) {
      console.error('Error deleting post:', error)
      throw error
    }
  }

  // Get user profile information
  static async getUserProfile(userId: string): Promise<User | null> {
    try {
      const userRef = doc(db, this.USERS_COLLECTION, userId)
      const userDoc = await getDoc(userRef)
      
      if (!userDoc.exists()) {
        return null
      }

      const data = userDoc.data()
      return {
        id: userDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastLoginAt: data.lastLoginAt?.toDate() || new Date()
      } as User
    } catch (error) {
      console.error('Error getting user profile:', error)
      throw error
    }
  }

  // Update user profile
  static async updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, this.USERS_COLLECTION, userId)
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  }

  // Follow/unfollow a user
  static async toggleFollow(currentUserId: string, targetUserId: string): Promise<void> {
    try {
      const currentUserRef = doc(db, this.USERS_COLLECTION, currentUserId)
      const currentUserDoc = await getDoc(currentUserRef)
      
      if (!currentUserDoc.exists()) {
        throw new Error('Current user not found')
      }

      const currentUserData = currentUserDoc.data()
      const following = currentUserData.following || []
      const isFollowing = following.includes(targetUserId)

      if (isFollowing) {
        // Unfollow
        await updateDoc(currentUserRef, {
          following: arrayRemove(targetUserId),
          updatedAt: serverTimestamp()
        })

        // Remove from target user's followers
        const targetUserRef = doc(db, this.USERS_COLLECTION, targetUserId)
        await updateDoc(targetUserRef, {
          followers: arrayRemove(currentUserId),
          updatedAt: serverTimestamp()
        })
      } else {
        // Follow
        await updateDoc(currentUserRef, {
          following: arrayUnion(targetUserId),
          updatedAt: serverTimestamp()
        })

        // Add to target user's followers
        const targetUserRef = doc(db, this.USERS_COLLECTION, targetUserId)
        await updateDoc(targetUserRef, {
          followers: arrayUnion(currentUserId),
          updatedAt: serverTimestamp()
        })
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
      throw error
    }
  }

  // Get trending posts (most liked in last 24 hours)
  static async getTrendingPosts(): Promise<Post[]> {
    try {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      const postsQuery = query(
        collection(db, this.POSTS_COLLECTION),
        where('createdAt', '>=', yesterday),
        orderBy('createdAt', 'desc'),
        limit(10)
      )

      const snapshot = await getDocs(postsQuery)
      const posts: Post[] = []

      snapshot.forEach((doc: any) => {
        const data = doc.data()
        posts.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        })
      })

      // Sort by likes count
      return posts.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    } catch (error) {
      console.error('Error getting trending posts:', error)
      throw error
    }
  }
}