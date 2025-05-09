import { useState, useEffect } from "react";
import {
  getEventComments,
  createEventComment,
  deleteEventComment,
  updateEventComment
} from "../services/eventCommentService";
import { format } from "date-fns";
import CommentForm from "./CommentForm";
import ReplyForm from "./ReplyForm";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

export default function EventCommentSection({ eventId }) {
  const { t } = useTranslation();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const [replyingTo, setReplyingTo] = useState(null);

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
      setError(t("comments.errors.loadFailed"));
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
      setError(t("comments.errors.addFailed"));
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm(t("comments.confirmDelete"))) {
      try {
        await deleteEventComment(eventId, commentId);
        setComments(comments.filter((comment) => comment.id !== commentId));
      } catch (err) {
        setError(t("comments.errors.deleteFailed"));
        console.error(err);
      }
    }
  };

  // Check if current user is author of comment or an admin
  const canDeleteComment = (comment) => {
    return (
      user && (comment.user_id === user.id || user.role === "administrator")
    );
  };
  
  const handleAddReply = async (commentId, replyData) => {
    try {
      const newReply = await createEventComment(eventId, {
        ...replyData,
        parent_id: commentId,
      });

      // Update the comments state to include the new reply
      setComments(
        comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [newReply, ...(comment.replies || [])],
            };
          }
          return comment;
        })
      );
    } catch (err) {
      setError(t("comments.errors.replyFailed"));
      console.error(err);
    }
  };

  // Render a single comment with its replies
  const renderComment = (comment) => (
    <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-gray-800">
            {comment.user?.name || t("comments.anonymous")}
          </p>
          <p className="text-sm text-gray-500">
            {format(new Date(comment.created_at), "MMMM d, yyyy • h:mm a")}
          </p>
        </div>
        <div className="flex space-x-3">
          {isAuthenticated && (
            <button
              onClick={() =>
                setReplyingTo(replyingTo === comment.id ? null : comment.id)
              }
              className="text-[#18bebc] hover:text-teal-800 text-sm"
            >
              {replyingTo === comment.id ? t("comments.buttons.cancel") : t("comments.buttons.reply")}
            </button>
          )}
          {canDeleteComment(comment) && (
            <button
              onClick={() => handleDeleteComment(comment.id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              {t("comments.buttons.delete")}
            </button>
          )}
        </div>
      </div>
      <p className="mt-2 text-gray-700">{comment.content}</p>

      {/* Reply form */}
      {replyingTo === comment.id && (
        <ReplyForm
          onAddReply={(data) => handleAddReply(comment.id, data)}
          onCancel={() => setReplyingTo(null)}
        />
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-3 pl-4 border-l-2 border-teal-100">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="bg-gray-100 p-3 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">
                    {reply.user?.name || t("comments.anonymous")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(
                      new Date(reply.created_at),
                      "MMMM d, yyyy • h:mm a"
                    )}
                  </p>
                </div>
                {canDeleteComment(reply) && (
                  <button
                    onClick={() => handleDeleteComment(reply.id)}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    {t("comments.buttons.delete")}
                  </button>
                )}
              </div>
              <p className="mt-1 text-gray-700 text-sm">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-6">{t("comments.title")}</h3>

      {isAuthenticated ? (
        <CommentForm onAddComment={handleAddComment} />
      ) : (
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <p className="text-gray-700">
            {t("comments.pleaseLogin")}{" "}
            <a href="/login" className="text-[#18bebc] hover:underline">
              {t("comments.loginLink")}
            </a>
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#18bebc]"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          {t("comments.noComments")}
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map(comment => renderComment(comment))}
        </div>
      )}
    </div>
  );
}