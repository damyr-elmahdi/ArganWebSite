// frontend/src/services/subjectService.js
import axios from 'axios';

// Get all subjects
export const getSubjects = async () => {
  return await axios.get('/api/subjects');
};

// Get single subject by id
export const getSubject = async (id) => {
  return await axios.get(`/api/subjects/${id}`);
};

// Create new subject
export const createSubject = async (subjectData) => {
  return await axios.post('/api/subjects', subjectData);
};

// Update subject
export const updateSubject = async (id, subjectData) => {
  return await axios.put(`/api/subjects/${id}`, subjectData);
};

// Delete subject
export const deleteSubject = async (id) => {
  return await axios.delete(`/api/subjects/${id}`);
};