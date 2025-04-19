import axios from 'axios';

export const getComments = async (newsId) => {
  try {
    const response = await axios.get(`/api/news/${newsId}/comments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const createComment = async (newsId, commentData) => {
  try {
    const response = await axios.post(`/api/news/${newsId}/comments`, commentData);
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const updateComment = async (newsId, commentId, commentData) => {
  try {
    const response = await axios.put(`/api/news/${newsId}/comments/${commentId}`, commentData);
    return response.data;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

export const deleteComment = async (newsId, commentId) => {
  try {
    const response = await axios.delete(`/api/news/${newsId}/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};