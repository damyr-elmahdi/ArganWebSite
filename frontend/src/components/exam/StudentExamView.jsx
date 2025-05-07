import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Search, Download, File, Calendar, BookOpen, Clock, Filter } from 'lucide-react';

const StudentExamView = () => {
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    // Extract unique subjects from exams
    if (exams.length > 0) {
      const uniqueSubjects = [...new Set(exams.map(exam => exam.subject))];
      setSubjects(uniqueSubjects);
    }
  }, [exams]);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/exams', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setExams(response.data);
    } catch (error) {
      console.error('Error fetching exams:', error);
      toast.error('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const downloadExam = async (examId) => {
    try {
      const response = await axios.get(`/api/exams/${examId}/download`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        responseType: 'blob'
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'exam.pdf';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Downloading exam...');
    } catch (error) {
      console.error('Error downloading exam:', error);
      toast.error('Failed to download exam');
    }
  };

  const openPdfViewer = async (exam) => {
    setSelectedExam(exam);
    setShowPdfViewer(true);
  };

  const closePdfViewer = () => {
    setShowPdfViewer(false);
    setSelectedExam(null);
  };

  // Filter exams based on search term and selected subject
  const filteredExams = exams.filter(exam => {
    const matchesSearch = 
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === '' || exam.subject === selectedSubject;
    
    return matchesSearch && matchesSubject;
  });

  // Group exams by subject
  const examsBySubject = filteredExams.reduce((acc, exam) => {
    if (!acc[exam.subject]) {
      acc[exam.subject] = [];
    }
    acc[exam.subject].push(exam);
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Exams</h1>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search exams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>
          <div className="w-full md:w-64">
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              <Filter className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* No Exams State */}
      {!loading && filteredExams.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No exams found</h3>
          <p className="text-gray-500">
            {searchTerm || selectedSubject
              ? "Try adjusting your search or filters"
              : "There are no exams available for your class yet"}
          </p>
        </div>
      )}

      {/* Exams by Subject */}
      {!loading && Object.keys(examsBySubject).length > 0 && (
        <div className="space-y-8">
          {Object.entries(examsBySubject).map(([subject, subjectExams]) => (
            <div key={subject} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">{subject}</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {subjectExams.map((exam) => (
                  <div key={exam.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start mb-2 md:mb-0">
                        <div className="bg-blue-100 p-2 rounded-lg mr-4">
                          <File className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{exam.title}</h3>
                          <div className="mt-1 flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-1">
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-1" />
                              <span>{new Date(exam.exam_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock size={14} className="mr-1" />
                              <span>{new Date(exam.created_at).toLocaleDateString()}</span>
                            </div>
                            {exam.description && (
                              <p className="text-gray-500 text-sm mt-1">{exam.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex mt-2 md:mt-0">
                        <button
                          onClick={() => openPdfViewer(exam)}
                          className="mr-2 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 text-sm flex items-center"
                        >
                          <BookOpen size={16} className="mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => downloadExam(exam.id)}
                          className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-md hover:bg-gray-200 text-sm flex items-center"
                        >
                          <Download size={16} className="mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PDF Viewer Modal */}
      {showPdfViewer && selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-5/6 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{selectedExam.title}</h3>
              <div className="flex items-center">
                <button
                  onClick={() => downloadExam(selectedExam.id)}
                  className="mr-4 text-gray-700 hover:text-blue-600 flex items-center"
                >
                  <Download size={18} className="mr-1" />
                  Download
                </button>
                <button
                  onClick={closePdfViewer}
                  className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                >
                  &times;
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={`/api/exams/${selectedExam.id}/download?token=${localStorage.getItem('token')}`}
                className="w-full h-full"
                title={selectedExam.title}
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentExamView;