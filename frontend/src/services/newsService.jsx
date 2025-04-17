// frontend/src/services/newsService.js
import axios from 'axios';

export const getNews = async (page = 1) => {
  try {
    const response = await axios.get(`/api/news?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

export const getNewsItem = async (id) => {
  try {
    const response = await axios.get(`/api/news/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching news item:', error);
    throw error;
  }
};

export const createNews = async (newsData) => {
  try {
    const response = await axios.post('/api/news', newsData);
    return response.data;
  } catch (error) {
    console.error('Error creating news:', error);
    throw error;
  }
};

export const updateNews = async (id, newsData) => {
  try {
    const response = await axios.put(`/api/news/${id}`, newsData);
    return response.data;
  } catch (error) {
    console.error('Error updating news:', error);
    throw error;
  }
};

export const deleteNews = async (id) => {
  try {
    const response = await axios.delete(`/api/news/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting news:', error);
    throw error;
  }
};

export const publishNews = async (id) => {
  try {
    const response = await axios.patch(`/api/news/${id}/publish`);
    return response.data;
  } catch (error) {
    console.error('Error publishing news:', error);
    throw error;
  }
};

export const archiveNews = async (id) => {
  try {
    const response = await axios.patch(`/api/news/${id}/archive`);
    return response.data;
  } catch (error) {
    console.error('Error archiving news:', error);
    throw error;
  }
};

// frontend/src/services/eventService.js
import axios from 'axios';

export const getEvents = async (params = {}) => {
  try {
    const response = await axios.get('/api/events', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const getEvent = async (id) => {
  try {
    const response = await axios.get(`/api/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await axios.post('/api/events', eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    const response = await axios.put(`/api/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (id) => {
  try {
    const response = await axios.delete(`/api/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};