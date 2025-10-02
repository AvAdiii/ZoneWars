import React, { useState } from 'react'

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (content: string, type: 'text' | 'achievement' | 'location') => void
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const [content, setContent] = useState('')
  const [postType, setPostType] = useState<'text' | 'achievement' | 'location'>('text')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim()) {
      onSubmit(content.trim(), postType)
      setContent('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Create New Post</h3>
          <button onClick={onClose} className="btn-secondary">
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group mb-md">
            <label htmlFor="postType">Post Type</label>
            <select 
              id="postType"
              value={postType} 
              onChange={(e) => setPostType(e.target.value as any)}
            >
              <option value="text">💬 Text Post</option>
              <option value="achievement">🏆 Achievement</option>
              <option value="location">📍 Location Update</option>
            </select>
          </div>
          
          <div className="form-group mb-md">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share something with the community..."
              rows={4}
              required
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Post
            </button>
          </div>
        </form>
      </div>
      
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: var(--z-modal);
          padding: var(--spacing-md);
        }
        
        .modal-content {
          background: var(--surface);
          border-radius: var(--radius-lg);
          width: 100%;
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-lg);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .modal-header h3 {
          margin: 0;
        }
        
        .modal-body {
          padding: var(--spacing-lg);
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }
        
        .form-group label {
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .modal-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: flex-end;
        }
      `}</style>
    </div>
  )
}

export default CreatePostModal