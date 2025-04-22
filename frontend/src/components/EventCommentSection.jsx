import { useState, useEffect } from 'react';
import { getEventComments, createEventComment, deleteEventComment } from '../services/eventCommentService';
import { format } from 'date-fns';
import CommentForm from './CommentForm';
import { useAuth } from '../contexts/AuthContext';

export default function EventCommentSection({ eventId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [eventId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getEventComments(eventId);
      setComments(data);
      setError(null);
    } catch (err) {
      setError('Failed to load comments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (commentData) => {
    try {
      const newComment = await createEventComment(eventId, commentData);
      setComments([newComment, ...comments]);
    } catch (err) {
      setError('Failed to add comment');
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteEventComment(eventId, commentId);
        setComments(comments.filter(comment => comment.id !== commentId));
      } catch (err) {
        setError('Failed to delete comment');
        console.error(err);
      }
    }
  };

  // Check if current user is author of comment or an admin
  const canDeleteComment = (comment) => {
    return user && (comment.user_id === user.id || user.role === 'administrator');
  };

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Comments</h3>
      
      {isAuthenticated ? (
        <CommentForm onAddComment={handleAddComment} />
      ) : (
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <p className="text-gray-700">Please <a href="/login" className="text-orange-600 hover:underline">log in</a> to leave a comment.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          No comments yet. Be the first to share your thoughts!
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map(comment => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">{comment.user?.name || 'Anonymous'}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(comment.created_at), 'MMMM d, yyyy • h:mm a')}
                  </p>
                </div>
                {canDeleteComment(comment) && (
                  <button 
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="mt-2 text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}