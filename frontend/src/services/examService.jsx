import axios from 'axios';

// Use a default API URL if the environment variable is not available
const API_URL = window.env?.REACT_APP_API_URL || '/api';

export const getExams = async (filters = {}) => {
  try {
    let url = `${API_URL}/exams`;
    const queryParams = new URLSearchParams();
    
    // Add filters to query parameters
    if (filters.class) queryParams.append('class', filters.class);
    if (filters.start_date) queryParams.append('start_date', filters.start_date);
    if (filters.end_date) queryParams.append('end_date', filters.end_date);
    if (filters.subject_id) queryParams.append('subject_id', filters.subject_id);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching exams:', error);
    throw error;
  }
};

export const getExamById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/exams/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching exam with ID ${id}:`, error);
    throw error;
  }
};

export const getExamsByClass = async (className) => {
  try {
    const response = await axios.get(`${API_URL}/exams/class/${className}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching exams for class ${className}:`, error);
    throw error;
  }
};

export const getClasses = async () => {
  try {
    const response = await axios.get(`${API_URL}/exams/classes/list`);
    return response.data;
  } catch (error) {
    console.error('Error fetching class list:', error);
    throw error;
  }
};

export const createExam = async (examData) => {
  try {
    const response = await axios.post(`${API_URL}/exams`, examData);
    return response.data;
  } catch (error) {
    console.error('Error creating exam:', error);
    throw error;
  }
};

export const updateExam = async (id, examData) => {
  try {
    const response = await axios.put(`${API_URL}/exams/${id}`, examData);
    return response.data;
  } catch (error) {
    console.error(`Error updating exam with ID ${id}:`, error);
    throw error;
  }
};

export const deleteExam = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/exams/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting exam with ID ${id}:`, error);
    throw error;
  }
};