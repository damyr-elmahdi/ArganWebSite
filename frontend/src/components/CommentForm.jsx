import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function CommentForm({ onAddComment }) {
  const { t } = useTranslation();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (content.trim().length < 3) {
      setError(t("commentForm.errors.tooShort"));
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onAddComment({ content });
      setContent("");
    } catch (err) {
      setError(t("commentForm.errors.submitFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="mb-4">
        <label
          htmlFor="comment"
          className="block text-gray-700 font-medium mb-2"
        >
          {t("commentForm.leaveComment")}
        </label>
        <textarea
          id="comment"
          rows="4"
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={t("commentForm.placeholder")}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (error) setError("");
          }}
          disabled={isSubmitting}
        ></textarea>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting || content.trim().length < 3}
        className="bg-[#18bebc] text-white px-6 py-2 rounded-md hover:bg-teal-700 transition disabled:bg-teal-300"
      >
        {isSubmitting ? t("commentForm.submitting") : t("commentForm.submit")}
      </button>
    </form>
  );
}