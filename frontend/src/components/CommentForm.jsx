import { useState } from 'react';

export default function CommentForm({ onAddComment }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    try {
      setIsSubmitting(true);
      await onAddComment({ content });
      setContent(''); // Clear form after submission
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          Leave a comment
        </label>
        <textarea
          id="comment"
          name="content"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder="Share your thoughts..."
          className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !content.trim()}
        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
          isSubmitting || !content.trim() 
            ? 'bg-orange-300 cursor-not-allowed' 
            : 'bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
        }`}
      >
        {isSubmitting ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}