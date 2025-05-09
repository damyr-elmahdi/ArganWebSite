import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function AbsenceManagement() {
  const { t } = useTranslation();
  const [teachers, setTeachers] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    teacher_id: "",
    start_date: "",
    end_date: "",
    reason: "",
  });

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get teachers for the dropdown
        const teachersResponse = await axios.get("/api/teachers");
        setTeachers(teachersResponse.data);
        
        // Get existing absences
        const absencesResponse = await axios.get("/api/absences");
        setAbsences(absencesResponse.data);
        
        setError("");
      } catch (err) {
        console.error("Error fetching absence data:", err);
        setError(t("absenceManagement.errors.loadFailed"));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [t]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await axios.post("/api/absences", formData);
      
      // Find teacher name for the new absence
      const teacher = teachers.find(t => t.id === parseInt(formData.teacher_id));
      const teacherName = teacher ? teacher.name : t("common.unknown");
      
      // Add the new absence to the list
      const newAbsence = {
        id: response.data.absence.id,
        teacher_name: teacherName,
        teacher_id: parseInt(formData.teacher_id),
        start_date: formData.start_date,
        end_date: formData.end_date,
        reason: formData.reason,
        announced_by: response.data.absence.announcer?.name || t("common.unknown"),
        is_active: true,
        created_at: new Date().toISOString(),
      };
      
      setAbsences([newAbsence, ...absences]);
      
      // Reset form
      setFormData({
        teacher_id: "",
        start_date: "",
        end_date: "",
        reason: "",
      });
      
      setShowForm(false);
      setError("");
    } catch (err) {
      console.error("Error creating absence:", err);
      setError(err.response?.data?.message || t("absenceManagement.errors.createFailed"));
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (absenceId) => {
    if (!window.confirm(t("absenceManagement.confirmDelete"))) {
      return;
    }
    
    try {
      await axios.delete(`/api/absences/${absenceId}`);
      // Remove the deleted absence from the list
      setAbsences(absences.filter(absence => absence.id !== absenceId));
    } catch (err) {
      console.error("Error deleting absence:", err);
      setError(err.response?.data?.message || t("absenceManagement.errors.deleteFailed"));
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {t("absenceManagement.title")}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {t("absenceManagement.subtitle")}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#18bebc] hover:bg-teal-700"
        >
          {showForm ? t("common.cancel") : t("absenceManagement.announceNew")}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Absence Form */}
      {showForm && (
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-6 gap-6">
              {/* Teacher Selection */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="teacher_id" className="block text-sm font-medium text-gray-700">
                  {t("absenceManagement.form.teacher")}
                </label>
                <select
                  id="teacher_id"
                  name="teacher_id"
                  value={formData.teacher_id}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-400 focus:border-teal-400 sm:text-sm"
                >
                  <option value="">{t("absenceManagement.form.selectTeacher")}</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} ({teacher.employee_id})
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Start Date */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                  {t("absenceManagement.form.startDate")}
                </label>
                <input
                  type="date"
                  name="start_date"
                  id="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  className="mt-1 focus:ring-teal-400 focus:border-teal-400 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              {/* End Date */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                  {t("absenceManagement.form.endDate")}
                </label>
                <input
                  type="date"
                  name="end_date"
                  id="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                  className="mt-1 focus:ring-teal-400 focus:border-teal-400 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              {/* Reason */}
              <div className="col-span-6">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                  {t("absenceManagement.form.reason")}
                </label>
                <textarea
                  name="reason"
                  id="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 focus:ring-teal-400 focus:border-teal-400 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder={t("absenceManagement.form.reasonPlaceholder")}
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400"
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#18bebc] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400"
              >
                {loading ? t("common.submitting") : t("absenceManagement.announceButton")}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Absence List */}
      <div className="border-t border-gray-200">
        {loading && !showForm ? (
          <div className="px-4 py-5 text-center">
            <p className="text-sm text-gray-500">{t("absenceManagement.loadingData")}</p>
          </div>
        ) : absences.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("absenceManagement.table.teacher")}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("absenceManagement.table.duration")}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("absenceManagement.table.reason")}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("absenceManagement.table.status")}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("absenceManagement.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {absences.map((absence) => (
                  <tr key={absence.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {absence.teacher_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(absence.start_date).toLocaleDateString()} - {new Date(absence.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {absence.reason || t("absenceManagement.notSpecified")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {absence.is_active ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {t("absenceManagement.status.active")}
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {t("absenceManagement.status.inactive")}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(absence.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        {t("common.delete")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-4 py-5 text-center">
            <p className="text-sm text-gray-500">{t("absenceManagement.noAbsences")}</p>
          </div>
        )}
      </div>
    </div>
  );
}