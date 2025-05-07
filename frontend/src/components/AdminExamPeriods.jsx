import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, Typography, Box, Button, Dialog, DialogActions, DialogContent, 
  DialogTitle, TextField, Grid, Switch, FormControlLabel, Paper, Table, 
  TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  Alert, Snackbar
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const AdminExamPeriods = () => {
  const [examPeriods, setExamPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    number_of_exams: 3,
    is_active: true
  });

  const fetchExamPeriods = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/exam-periods');
      setExamPeriods(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load exam periods');
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExamPeriods();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddNew = () => {
    setSelectedPeriod(null);
    setFormData({
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      number_of_exams: 3,
      is_active: true
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (period) => {
    setSelectedPeriod(period);
    setFormData({
      name: period.name,
      description: period.description || '',
      start_date: format(new Date(period.start_date), 'yyyy-MM-dd'),
      end_date: format(new Date(period.end_date), 'yyyy-MM-dd'),
      number_of_exams: period.number_of_exams,
      is_active: period.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (period) => {
    setSelectedPeriod(period);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/exam-periods/${selectedPeriod.id}`);
      setSnackbar({
        open: true,
        message: 'Exam period deleted successfully',
        severity: 'success'
      });
      fetchExamPeriods();
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to delete exam period',
        severity: 'error'
      });
      console.error(err);
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedPeriod) {
        // Update existing period
        await axios.put(`/api/exam-periods/${selectedPeriod.id}`, formData);
        setSnackbar({
          open: true,
          message: 'Exam period updated successfully',
          severity: 'success'
        });
      } else {
        // Create new period
        await axios.post('/api/exam-periods', formData);
        setSnackbar({
          open: true,
          message: 'Exam period created successfully',
          severity: 'success'
        });
      }
      
      setIsDialogOpen(false);
      fetchExamPeriods();
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Error saving exam period',
        severity: 'error'
      });
      console.error(err);
    }
  };

  const handleManageSchedules = (periodId) => {
    navigate(`/admin/exam-schedules/${periodId}`);
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Exam Periods Management</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Add />}
            onClick={handleAddNew}
          >
            Add New Exam Period
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Typography>Loading exam periods...</Typography>
        ) : examPeriods.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Number of Exams</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {examPeriods.map((period) => (
                  <TableRow key={period.id}>
                    <TableCell>{period.name}</TableCell>
                    <TableCell>{format(new Date(period.start_date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{format(new Date(period.end_date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{period.number_of_exams}</TableCell>
                    <TableCell>
                      {period.is_active ? (
                        <Typography color="success.main">Active</Typography>
                      ) : (
                        <Typography color="text.secondary">Inactive</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleManageSchedules(period.id)}
                        title="Manage Schedules"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton 
                        color="info" 
                        onClick={() => handleEdit(period)}
                        title="Edit Period"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDelete(period)}
                        title="Delete Period"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography>No exam periods found. Click "Add New Exam Period" to create one.</Typography>
          </Paper>
        )}
      </Box>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedPeriod ? 'Edit Exam Period' : 'Create New Exam Period'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Period Name"
                  fullWidth
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.description}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="start_date"
                  label="Start Date"
                  type="date"
                  fullWidth
                  required
                  value={formData.start_date}
                  onChange={handleInputChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="end_date"
                  label="End Date"
                  type="date"
                  fullWidth
                  required
                  value={formData.end_date}
                  onChange={handleInputChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="number_of_exams"
                  label="Number of Exams"
                  type="number"
                  fullWidth
                  required
                  value={formData.number_of_exams}
                  onChange={handleInputChange}
                  margin="normal"
                  inputProps={{ min: 1, max: 10 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      color="primary"
                    />
                  }
                  label="Active"
                  margin="normal"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedPeriod ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the exam period "{selectedPeriod?.name}"?
            This will also delete all associated exam schedules.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
}
export default AdminExamPeriods ;