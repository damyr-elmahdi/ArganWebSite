import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Button, Paper, Tabs, Tab, Grid,
  FormControl, InputLabel, Select, MenuItem, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Alert, Snackbar, Card, CardContent, Divider,
  Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { Save, ArrowBack, Add, Delete } from '@mui/icons-material';
import { format } from 'date-fns';

const AdminExamSchedules = () => {
  const { periodId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [examPeriod, setExamPeriod] = useState(null);
  const [classCodes, setClassCodes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedClassCode, setSelectedClassCode] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isSaving, setIsSaving] = useState(false);
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch exam period details
        const examPeriodResponse = await axios.get(`/api/exam-periods/${periodId}`);
        setExamPeriod(examPeriodResponse.data.exam_period);
        
        // Set schedules by class
        const schedulesByClass = examPeriodResponse.data.schedules_by_class || {};
        
        // Fetch reference data
        const [classCodesResponse, subjectsResponse, teachersResponse] = await Promise.all([
          axios.get('/api/exam/class-codes'),
          axios.get('/api/exam/subjects'),
          axios.get('/api/exam/teachers')
        ]);
        
        setClassCodes(classCodesResponse.data);
        setSubjects(subjectsResponse.data);
        setTeachers(teachersResponse.data);
        
        // If class codes are available, select the first one
        if (classCodesResponse.data.length > 0) {
          const firstClassCode = classCodesResponse.data[0].value;
          setSelectedClassCode(firstClassCode);
          
          // Initialize schedules for the selected class and exam period
          initializeSchedules(
            firstClassCode, 
            examPeriodResponse.data.exam_period.number_of_exams,
            schedulesByClass[firstClassCode] || []
          );
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchData();
  }, [periodId]);
  
  // Initialize schedules for a class
  const initializeSchedules = (classCode, numExams, existingSchedules = []) => {
    // Group existing schedules by subject and exam order
    const existingMap = {};
    existingSchedules.forEach(schedule => {
      existingMap[`${schedule.subject}_${schedule.exam_order}`] = schedule;
    });
    
    // Create an array to hold schedules for all required exams
    const newSchedules = [];
    
    // For each subject
    subjects.forEach(subject => {
      // For each exam (1 to numExams)
      for (let examOrder = 1; examOrder <= numExams; examOrder++) {
        const key = `${subject}_${examOrder}`;
        
        if (existingMap[key]) {
          // Use existing schedule
          newSchedules.push(existingMap[key]);
        } else {
          // Create a new schedule placeholder
          newSchedules.push({
            exam_period_id: periodId,
            class_code: classCode,
            subject: subject,
            teacher_id: '',
            exam_date: '',
            exam_order: examOrder,
            notes: '',
            isNew: true // Flag to mark as a new record
          });
        }
      }
    });
    
    setSchedules(newSchedules);
  };
  
  // Handle class code change
  const handleClassCodeChange = (e) => {
    const newClassCode = e.target.value;
    setSelectedClassCode(newClassCode);
    
    if (examPeriod) {
      // Get existing schedules for this class from API
      axios.get(`/api/exam-periods/${periodId}`)
        .then(response => {
          const schedulesByClass = response.data.schedules_by_class || {};
          initializeSchedules(
            newClassCode, 
            examPeriod.number_of_exams,
            schedulesByClass[newClassCode] || []
          );
        })
        .catch(err => {
          console.error('Failed to load schedules for class', err);
          // Initialize with empty schedules
          initializeSchedules(newClassCode, examPeriod.number_of_exams, []);
        });
    }
  };
  
  // Handle schedule field change
  const handleScheduleChange = (index, field, value) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index] = {
      ...updatedSchedules[index],
      [field]: value
    };
    setSchedules(updatedSchedules);
  };
  
  // Group schedules by exam order
  const getSchedulesByExamOrder = () => {
    const grouped = {};
    schedules.forEach(schedule => {
      if (!grouped[schedule.exam_order]) {
        grouped[schedule.exam_order] = [];
      }
      grouped[schedule.exam_order].push(schedule);
    });
    return grouped;
  };
  
  // Save all schedules
  const saveSchedules = async () => {
    // Validate required fields
    const invalidSchedules = schedules.filter(
      s => !s.exam_date || (s.teacher_id === '' && s.teacher_id !== null)
    );
    
    if (invalidSchedules.length > 0) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields (date and teacher) for all schedules.',
        severity: 'error'
      });
      return;
    }
    
    setIsSaving(true);
    try {
      // Send only non-empty schedules
      const schedulesToSave = schedules.filter(s => s.exam_date && s.teacher_id !== '');
      
      await axios.post(`/api/exam-periods/${periodId}/schedules`, {
        schedules: schedulesToSave
      });
      
      setSnackbar({
        open: true,
        message: 'Exam schedules saved successfully',
        severity: 'success'
      });
      
      // Refresh data
      const response = await axios.get(`/api/exam-periods/${periodId}`);
      const schedulesByClass = response.data.schedules_by_class || {};
      initializeSchedules(
        selectedClassCode, 
        examPeriod.number_of_exams,
        schedulesByClass[selectedClassCode] || []
      );
      
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to save exam schedules',
        severity: 'error'
      });
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };
  
  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  const goBack = () => {
    navigate('/admin/exam-periods');
  };
  
  if (loading) {
    return <Typography sx={{ p: 3 }}>Loading exam schedules...</Typography>;
  }
  
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={goBack}
          sx={{ mt: 2 }}
        >
          Back to Exam Periods
        </Button>
      </Box>
    );
  }
  
  if (!examPeriod) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Exam period not found</Alert>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={goBack}
          sx={{ mt: 2 }}
        >
          Back to Exam Periods
        </Button>
      </Box>
    );
  }
  
  const groupedSchedules = getSchedulesByExamOrder();
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Button 
              startIcon={<ArrowBack />} 
              onClick={goBack}
              sx={{ mb: 1 }}
            >
              Back to Exam Periods
            </Button>
            <Typography variant="h4">
              {examPeriod.name} - Schedules
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {format(new Date(examPeriod.start_date), 'MMM d, yyyy')} - {format(new Date(examPeriod.end_date), 'MMM d, yyyy')}
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<Save />}
            onClick={saveSchedules}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Schedules'}
          </Button>
        </Box>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="class-select-label">Class</InputLabel>
            <Select
              labelId="class-select-label"
              value={selectedClassCode}
              label="Class"
              onChange={handleClassCodeChange}
            >
              {classCodes.map((classCode) => (
                <MenuItem key={classCode.value} value={classCode.value}>
                  {classCode.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
        
        {selectedClassCode && (
          <Box>
            {Object.entries(groupedSchedules)
              .sort(([orderA], [orderB]) => Number(orderA) - Number(orderB))
              .map(([examOrder, orderSchedules]) => (
                <Card key={examOrder} sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Exam #{examOrder}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Subject</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Teacher</TableCell>
                            <TableCell>Notes</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orderSchedules.map((schedule, index) => {
                            const scheduleIndex = schedules.findIndex(s => 
                              s.subject === schedule.subject && s.exam_order === parseInt(examOrder)
                            );
                            
                            return (
                              <TableRow key={`${schedule.subject}_${examOrder}`}>
                                <TableCell>{schedule.subject}</TableCell>
                                
                                <TableCell>
                                  <TextField
                                    type="date"
                                    size="small"
                                    fullWidth
                                    required
                                    value={schedule.exam_date || ''}
                                    onChange={(e) => handleScheduleChange(scheduleIndex, 'exam_date', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                </TableCell>
                                
                                <TableCell>
                                  <FormControl fullWidth size="small">
                                    <Select
                                      value={schedule.teacher_id || ''}
                                      onChange={(e) => handleScheduleChange(scheduleIndex, 'teacher_id', e.target.value)}
                                      displayEmpty
                                      required
                                    >
                                      <MenuItem value="">
                                        <em>Select Teacher</em>
                                      </MenuItem>
                                      {teachers.map((teacher) => (
                                        <MenuItem key={teacher.id} value={teacher.id}>
                                          {teacher.name} - {teacher.specialization || teacher.department || 'No specialization'}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </TableCell>
                                
                                <TableCell>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    placeholder="Optional notes"
                                    value={schedule.notes || ''}
                                    onChange={(e) => handleScheduleChange(scheduleIndex, 'notes', e.target.value)}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              ))}
          </Box>
        )}
      </Box>
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminExamSchedules;