import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Box, Grid, Select, MenuItem, FormControl, InputLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert } from '@mui/material';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { format } from 'date-fns';

const StudentExamSchedule = () => {
  const [examPeriods, setExamPeriods] = useState([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all active exam periods
  useEffect(() => {
    const fetchExamPeriods = async () => {
      try {
        const response = await axios.get('/api/exam-periods');
        setExamPeriods(response.data);
        
        // Auto-select the first active exam period if available
        if (response.data.length > 0) {
          const activePeriod = response.data.find(period => period.is_active);
          if (activePeriod) {
            setSelectedPeriodId(activePeriod.id);
          } else if (response.data.length > 0) {
            setSelectedPeriodId(response.data[0].id);
          }
        }
      } catch (err) {
        setError('Failed to load exam periods');
        console.error(err);
      }
    };

    fetchExamPeriods();
  }, []);

  // Fetch schedules when period selection changes
  useEffect(() => {
    if (!selectedPeriodId) return;

    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/exam-periods/${selectedPeriodId}`);
        setSchedules(response.data.schedules || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load exam schedules');
        setLoading(false);
        console.error(err);
      }
    };

    fetchSchedules();
  }, [selectedPeriodId]);

  const handlePeriodChange = (event) => {
    setSelectedPeriodId(event.target.value);
  };

  // Group schedules by exam order
  const groupedSchedules = schedules.reduce((acc, schedule) => {
    if (!acc[schedule.exam_order]) {
      acc[schedule.exam_order] = [];
    }
    acc[schedule.exam_order].push(schedule);
    return acc;
  }, {});

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Exam Schedule
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="exam-period-label">Exam Period</InputLabel>
        <Select
          labelId="exam-period-label"
          value={selectedPeriodId}
          label="Exam Period"
          onChange={handlePeriodChange}
          disabled={loading}
        >
          <MenuItem value="" disabled>
            Select an exam period
          </MenuItem>
          {examPeriods.map((period) => (
            <MenuItem key={period.id} value={period.id}>
              {period.name} ({format(new Date(period.start_date), 'MMM d, yyyy')} - {format(new Date(period.end_date), 'MMM d, yyyy')})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading ? (
        <Typography>Loading schedules...</Typography>
      ) : schedules.length > 0 ? (
        <Box>
          {Object.entries(groupedSchedules)
            .sort(([orderA], [orderB]) => Number(orderA) - Number(orderB))
            .map(([examOrder, orderSchedules]) => (
              <Card key={examOrder} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Exam #{examOrder}
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Subject</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Teacher</TableCell>
                          {orderSchedules.some(s => s.notes) && <TableCell>Notes</TableCell>}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderSchedules.map((schedule) => (
                          <TableRow key={schedule.id}>
                            <TableCell>{schedule.subject}</TableCell>
                            <TableCell>{format(new Date(schedule.exam_date), 'EEEE, MMMM d, yyyy')}</TableCell>
                            <TableCell>{schedule.teacher?.user?.name || 'Not assigned'}</TableCell>
                            {orderSchedules.some(s => s.notes) && <TableCell>{schedule.notes}</TableCell>}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            ))}
        </Box>
      ) : selectedPeriodId ? (
        <Typography>No exam schedules available for this period.</Typography>
      ) : (
        <Typography>Please select an exam period to view schedules.</Typography>
      )}
    </Box>
  );
};

export default StudentExamSchedule;