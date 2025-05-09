import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ReplyForm({ onAddReply, onCancel }) {
  const { t } = useTranslation();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (content.trim().length < 3) {
      setError(t("replyForm.errors.tooShort"));
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onAddReply({ content });
      onCancel();
    } catch (err) {
      setError(t("replyForm.errors.submitFailed"));
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 mb-2">
      <div className="mb-3">
        <textarea
          rows="3"
          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={t("replyForm.placeholder")}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (error) setError("");
          }}
          disabled={isSubmitting}
        ></textarea>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
      <div className="flex space-x-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 transition"
          disabled={isSubmitting}
        >
          {t("replyForm.cancel")}
        </button>
        <button
          type="submit"
          disabled={isSubmitting || content.trim().length < 3}
          className="bg-[#18bebc] text-white px-4 py-1 rounded-md text-sm hover:bg-teal-700 transition disabled:bg-teal-300"
        >
          {isSubmitting ? t("replyForm.submitting") : t("replyForm.reply")}
        </button>
      </div>
    </form>
  );
}