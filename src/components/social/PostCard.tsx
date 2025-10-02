import React from 'react'
import { Post } from '../../types'

interface PostCardProps {
  post: Post
  onLike: () => void
  onComment: (content: string) => void
  onDelete?: () => void
  currentUserId?: string
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onLike, 
  onComment, 
  onDelete, 
  currentUserId 
}) => {
  const [showComments, setShowComments] = React.useState(false)
  const [commentText, setCommentText] = React.useState('')

  const handleComment = () => {
    if (commentText.trim()) {
      onComment(commentText.trim())
      setCommentText('')
    }
  }

  const isLiked = currentUserId ? post.likes?.includes(currentUserId) : false
  const likesCount = post.likes?.length || 0

  return (
    <div className="card mb-md">
      <div className="post-header flex justify-between items-center mb-sm">
        <div className="flex items-center gap-sm">
          <div className="avatar">
            {post.authorDisplayName?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h4 className="mb-xs">{post.authorDisplayName || 'Anonymous'}</h4>
            <p className="text-secondary text-sm">
              {post.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>
        {currentUserId === post.authorId && onDelete && (
          <button onClick={onDelete} className="btn-error">
            Delete
          </button>
        )}
      </div>
      
      <div className="post-content mb-md">
        <p>{post.content}</p>
      </div>
      
      <div className="post-actions flex gap-md">
        <button 
          onClick={onLike}
          className={`flex items-center gap-xs ${isLiked ? 'text-error' : 'text-secondary'}`}
        >
          {isLiked ? '❤️' : '🤍'} {likesCount}
        </button>
        
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-xs text-secondary"
        >
          💬 {post.commentCount || 0}
        </button>
      </div>
      
      {showComments && (
        <div className="comments-section mt-md">
          <div className="flex gap-sm mb-sm">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1"
            />
            <button onClick={handleComment} className="btn-primary">
              Post
            </button>
          </div>
          
          <div className="comments-list">
            {post.comments?.map((comment) => (
              <div key={comment.id} className="comment mb-sm p-sm rounded">
                <div className="flex items-center gap-xs mb-xs">
                  <strong>{comment.authorDisplayName || 'Anonymous'}</strong>
                  <span className="text-secondary text-sm">
                    {comment.createdAt.toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <style jsx>{`
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }
        
        .comment {
          background: var(--background-secondary);
          border-left: 3px solid var(--primary-color);
        }
        
        .text-sm {
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  )
}

export default PostCard