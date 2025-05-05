import { useState } from 'react';

export default function ReplyForm({ onAddReply, onCancel }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    try {
      setIsSubmitting(true);
      await onAddReply({ content });
      setContent(''); // Clear form after submission
      onCancel(); // Close the reply form
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 mb-4 pl-4 border-l-2 border-teal-200">
      <div className="mb-2">
        <textarea
          id="reply"
          name="content"
          rows={2}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder="Write your reply..."
          className="shadow-sm focus:ring-teal-400 focus:border-teal-400 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className={`inline-flex justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
            isSubmitting || !content.trim() 
              ? 'bg-teal-300 cursor-not-allowed' 
              : 'bg-[#18bebc] hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400'
          }`}
        >
          {isSubmitting ? 'Posting...' : 'Reply'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center py-1 px-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}