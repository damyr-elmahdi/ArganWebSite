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
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
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