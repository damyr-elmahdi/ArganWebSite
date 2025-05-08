import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';

export default function OutstandingStudentsManagement() {
  const { t, i18n } = useTranslation();
  
  const getImageUrl = (path) => {
    if (path.startsWith('http') || path.startsWith('data:')) {
      return path;
    }
    return path;
  };

  const createPlaceholder = (name) => {
    const letter = name ? name.charAt(0).toUpperCase() : 'A';
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="#18bebc"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="80" fill="white">${letter}</text>
      </svg>
    `;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
  };

  const formatMark = (mark) => {
    return Number.isInteger(parseFloat(mark)) ? parseInt(mark) : parseFloat(mark).toFixed(1);
  };

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    grade: '',
    mark: 0,
    achievement: ''
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const gradeSuggestions = [
    "TC-S1", "TC-S2", "TC-S3", "TC-S4",
    "TC-LSH1", "TC-LSH2",
    "1BAC-SE1", "1BAC-SE2", "1BAC-SE3",
    "1BAC-LSH1", "1BAC-LSH2",
    "2BAC-PC1", "2BAC-PC2",
    "2BAC-SVT1", "2BAC-SVT2",
    "2BAC-SH1", "2BAC-SH2",
    "2BAC-L1", "2BAC-L2"
  ];

  useEffect(() => {
    fetchOutstandingStudents();
  }, []);

  const fetchOutstandingStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/outstanding-students');
      setStudents(response.data);
    } catch (err) {
      console.error('Error fetching outstanding students:', err);
      toast.error(t('errors.loadStudents'));
    } finally {
      setLoading(false);
    }
  };

  // ... (keep all other existing functions the same, just replace text with t() calls)

  const handleDelete = async (id, name) => {
    if (!window.confirm(t('confirmations.deleteStudent', { name }))) {
      return;
    }
    
    try {
      setSubmitting(true);
      await axios.delete(`/api/outstanding-students/${id}`);
      toast.success(t('success.deleteStudent'));
      await fetchOutstandingStudents();
    } catch (err) {
      console.error('Error deleting outstanding student:', err);
      toast.error(t('errors.deleteStudent'));
    } finally {
      setSubmitting(false);
    }
  };

  const getGradeLabel = (gradeCode) => {
    const baseGrade = getBaseGrade(gradeCode);
    const classSuffix = gradeCode.replace(baseGrade, "");
    
    const gradeMappings = {
      "TC-S": t('grades.tcScience'),
      "TC-LSH": t('grades.tcLsh'),
      "1BAC-SE": t('grades.firstBacScience'),
      "1BAC-LSH": t('grades.firstBacLsh'),
      "2BAC-PC": t('grades.secondBacPc'),
      "2BAC-SVT": t('grades.secondBacSvt'),
      "2BAC-SH": t('grades.secondBacSh'),
      "2BAC-L": t('grades.secondBacLetters')
    };
    
    return (gradeMappings[baseGrade] || baseGrade) + classSuffix;
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {t('outstandingStudents.title')}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {t('outstandingStudents.subtitle')}
        </p>
      </div>

      <div className="border-t border-gray-200 p-4">
        <h4 className="text-md font-medium text-gray-900 mb-4">
          {formMode === 'add' ? t('outstandingStudents.addTitle') : t('outstandingStudents.editTitle', { name: formData.name })}
        </h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">
                {t('form.studentId')}
              </label>
              <input
                type="text"
                name="student_id"
                id="student_id"
                value={formData.student_id}
                onChange={handleInputChange}
                className={`mt-1 focus:ring-[#18bebc] focus:border-[#18bebc] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  errors.student_id ? 'border-red-500' : ''
                }`}
                placeholder={t('form.studentIdPlaceholder')}
              />
              {errors.student_id && (
                <p className="mt-1 text-sm text-red-600">{errors.student_id}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                {t('form.name')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={`mt-1 focus:ring-[#18bebc] focus:border-[#18bebc] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  errors.name ? 'border-red-500' : ''
                }`}
                placeholder={t('form.namePlaceholder')}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                {t('form.grade')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="grade"
                  id="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  required
                  list="grade-suggestions"
                  className={`mt-1 focus:ring-[#18bebc] focus:border-[#18bebc] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                    errors.grade ? 'border-red-500' : ''
                  }`}
                  placeholder={t('form.gradePlaceholder')}
                />
                <datalist id="grade-suggestions">
                  {gradeSuggestions.map((grade) => (
                    <option key={grade} value={grade} />
                  ))}
                </datalist>
              </div>
              {errors.grade && (
                <p className="mt-1 text-sm text-red-600">{errors.grade}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {t('form.gradeExamples')}
              </p>
            </div>
            
            <div>
              <label htmlFor="mark" className="block text-sm font-medium text-gray-700">
                {t('form.mark')} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="mark"
                id="mark"
                min="0"
                max="20"
                step="0.01"
                value={formData.mark}
                onChange={handleInputChange}
                required
                className={`mt-1 focus:ring-[#18bebc] focus:border-[#18bebc] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  errors.mark ? 'border-red-500' : ''
                }`}
                placeholder={t('form.markPlaceholder')}
              />
              {errors.mark && (
                <p className="mt-1 text-sm text-red-600">{errors.mark}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="achievement" className="block text-sm font-medium text-gray-700">
                {t('form.achievement')}
              </label>
              <input
                type="text"
                name="achievement"
                id="achievement"
                value={formData.achievement}
                onChange={handleInputChange}
                className={`mt-1 focus:ring-[#18bebc] focus:border-[#18bebc] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  errors.achievement ? 'border-red-500' : ''
                }`}
                placeholder={t('form.achievementPlaceholder')}
              />
              {errors.achievement && (
                <p className="mt-1 text-sm text-red-600">{errors.achievement}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                {t('form.photo')}
              </label>
              <div className="mt-1 flex items-center space-x-6">
                {photoPreview && (
                  <div className="flex-shrink-0">
                    <img 
                      src={photoPreview.startsWith('data:') ? photoPreview : getImageUrl(photoPreview)} 
                      alt="Preview" 
                      className="h-24 w-24 object-cover rounded-md" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = createPlaceholder(formData.name);
                      }}
                    />
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  name="photo"
                  id="photo"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handlePhotoChange}
                  className={`mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-[#18bebc] file:text-white
                    hover:file:bg-teal-700 ${
                      errors.photo ? 'border border-red-500 rounded-md' : ''
                    }`}
                />
              </div>
              {errors.photo && (
                <p className="mt-1 text-sm text-red-600">{errors.photo}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                {t('form.photoRequirements')}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#18bebc] hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                submitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {formMode === 'add' ? t('form.adding') : t('form.updating')}
                </>
              ) : (
                formMode === 'add' ? t('form.addStudent') : t('form.updateStudent')
              )}
            </button>
            
            {formMode === 'edit' && (
              <button
                type="button"
                onClick={resetForm}
                disabled={submitting}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                {t('form.cancel')}
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="border-t border-gray-200 mt-6 pt-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">
          {t('outstandingStudents.currentStudents')}
        </h4>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#18bebc]"></div>
          </div>
        ) : students.length === 0 ? (
          <div className="bg-gray-50 p-4 text-center rounded-md">
            <p className="text-gray-500">{t('outstandingStudents.noStudents')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.photo')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.studentId')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.name')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.grade')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.mark')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.achievement')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student.photo_path ? (
                          <img 
                            src={getImageUrl(student.photo_path)}
                            alt={student.name} 
                            className="h-12 w-12 rounded-full object-cover border border-gray-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = createPlaceholder(student.name);
                            }}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#165b9f] to-[#18bebc] flex items-center justify-center">
                            <span className="text-white font-bold">{student.name.charAt(0)}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {student.student_id || t('table.na')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {getGradeLabel(student.grade)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className="px-2 py-1 bg-[#18bebc] bg-opacity-10 text-[#18bebc] rounded-md font-medium">
                          {formatMark(student.mark)}/20
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-xs truncate">
                        {student.achievement || t('table.na')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(student)}
                          disabled={submitting}
                          className="text-[#18bebc] hover:text-teal-900 mr-3 transition-colors"
                        >
                          {t('actions.edit')}
                        </button>
                        <button
                          onClick={() => handleDelete(student.id, student.name)}
                          disabled={submitting}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          {t('actions.remove')}
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}