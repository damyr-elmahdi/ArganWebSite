import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function CommentForm({ onAddComment }) {
  const { t } = useTranslation();
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
          {t('comments.leaveComment')}
        </label>
        <textarea
          id="comment"
          name="content"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder={t('comments.placeholder')}
          className="shadow-sm focus:ring-teal-400 focus:border-teal-400 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !content.trim()}
        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
          isSubmitting || !content.trim() 
            ? 'bg-teal-300 cursor-not-allowed' 
            : 'bg-[#18bebc] hover:bg-[#2cadab] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#38e1de]'
        }`}
      >
        {isSubmitting ? t('comments.posting') : t('comments.post')}
      </button>
    </form>
  );
}