import axios from 'axios';

export const getEventComments = async (eventId) => {
  try {
    const response = await axios.get(`/api/events/${eventId}/comments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event comments:', error);
    throw error;
  }
};

export const createEventComment = async (eventId, commentData) => {
  try {
    const response = await axios.post(`/api/events/${eventId}/comments`, commentData);
    return response.data;
  } catch (error) {
    console.error('Error creating event comment:', error);
    throw error;
  }
};

export const updateEventComment = async (eventId, commentId, commentData) => {
  try {
    const response = await axios.put(`/api/events/${eventId}/comments/${commentId}`, commentData);
    return response.data;
  } catch (error) {
    console.error('Error updating event comment:', error);
    throw error;
  }
};

export const deleteEventComment = async (eventId, commentId) => {
  try {
    await axios.delete(`/api/events/${eventId}/comments/${commentId}`);
    return true;
  } catch (error) {
    console.error('Error deleting event comment:', error);
    throw error;
  }
};