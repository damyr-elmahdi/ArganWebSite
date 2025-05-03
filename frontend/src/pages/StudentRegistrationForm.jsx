import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StudentRegistrationFormFrench() {
  const [formData, setFormData] = useState({
    full_name: "",
    grade_applying_for: "",
    parent_name: "",
    parent_occupation: "",
    father_phone: "",
    mother_phone: "",
    student_phone: "",
    address: "",
    family_status: "with_parents",
    orphan_date: "",
    previous_school: "",
    additional_notes: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registrationId, setRegistrationId] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    // Nous ne stockons pas le fichier dans formData car il sera traité séparément par FormData
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Créer un objet FormData pour gérer les téléchargements de fichiers
    const submitData = new FormData();
    
    // Ajouter tous les champs du formulaire à FormData
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    
    // Ajouter le fichier s'il existe
    if (fileInputRef.current.files[0]) {
      submitData.append('info_packet', fileInputRef.current.files[0]);
    }

    try {
      const response = await axios.post("/api/registrations", submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setSuccess("Inscription soumise avec succès !");
      setRegistrationId(response.data.registration.id);
      window.scrollTo(0, 0); // Faire défiler vers le haut pour afficher le message de succès
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.data && err.response.data.errors) {
        // Gérer les erreurs de validation
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else {
        setError("Une erreur s'est produite lors de l'inscription. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      // Try the improved mPDF endpoint which has better Arabic support
      const response = await axios.get(`/api/registrations/${registrationId}/generate-pdf-with-mpdf`, {
        responseType: 'blob',
        // Add timeout to prevent long loading times
        timeout: 30000
      });
      
      // Check if response is a blob and is a PDF
      const contentType = response.headers['content-type'];
      if (response.data instanceof Blob && contentType && contentType.includes('application/pdf')) {
        // Create a URL for the blob and trigger a download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `registration_${registrationId}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Release the blob URL
        window.URL.revokeObjectURL(url);
      } else {
        // If response is not a proper PDF blob
        throw new Error("Invalid PDF response from server");
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("PDF download error:", error);
      
      // Check if the error response contains detailed error information
      if (error.response && error.response.data) {
        try {
          // Try to parse the error if it's returned as JSON
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const errorData = JSON.parse(reader.result);
              setError(errorData.message || "Failed to download PDF. Please try again.");
            } catch (e) {
              setError("Failed to download PDF. Please try again.");
            }
          };
          reader.readAsText(error.response.data);
        } catch (e) {
          setError("Failed to download PDF. Please try again.");
        }
      } else {
        setError("Failed to download PDF. Please contact support for assistance.");
      }
      
      setIsLoading(false);
    }
  };

  // Niveaux scolaires disponibles
  const gradeOptions = [
    { value: "TC-S", label: "TC - Sciences" },
    { value: "TC-LSH", label: "TC - Lettres et Sciences Humaines" },
    { value: "1BAC-SE", label: "1BAC - Sciences Expérimentales" },
    { value: "1BAC-LSH", label: "1BAC - Lettres et Sciences Humaines" },
    { value: "2BAC-PC", label: "2BAC - PC (Physique-Chimie)" },
    { value: "2BAC-SVT", label: "2BAC - SVT (Sciences de la Vie et de la Terre)" },
    { value: "2BAC-SH", label: "2BAC - Sciences Humaines" },
    { value: "2BAC-L", label: "2BAC - Lettres" },
  ];

  return (
    <main className="flex-grow flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="max-w-3xl w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Formulaire d'Inscription</h2>
          <p className="mt-2 text-gray-600">
            Veuillez remplir le formulaire suivant pour l'inscription de l'élève
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Informations de l'élève */}
            <h3 className="text-xl font-medium text-gray-700 border-b pb-2">Informations de l'Élève</h3>
            
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                Nom complet de l'élève
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="Nom complet"
                value={formData.full_name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="grade_applying_for" className="block text-sm font-medium text-gray-700">
                Niveau scolaire
              </label>
              <select
                id="grade_applying_for"
                name="grade_applying_for"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                value={formData.grade_applying_for}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="">Choisir un niveau scolaire</option>
                {gradeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="student_phone" className="block text-sm font-medium text-gray-700">
                Téléphone de l'élève
              </label>
              <input
                id="student_phone"
                name="student_phone"
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="0600000000"
                value={formData.student_phone}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="previous_school" className="block text-sm font-medium text-gray-700">
                École précédente
              </label>
              <input
                id="previous_school"
                name="previous_school"
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="Nom de l'école précédente"
                value={formData.previous_school}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            {/* Informations du parent */}
            <h3 className="text-xl font-medium text-gray-700 border-b pb-2 mt-8">Informations du Parent/Tuteur</h3>
            
            <div>
              <label htmlFor="parent_name" className="block text-sm font-medium text-gray-700">
                Nom complet du père ou tuteur
              </label>
              <input
                id="parent_name"
                name="parent_name"
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="Nom du parent/tuteur"
                value={formData.parent_name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="parent_occupation" className="block text-sm font-medium text-gray-700">
                Profession du parent/tuteur
              </label>
              <input
                id="parent_occupation"
                name="parent_occupation"
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="Profession"
                value={formData.parent_occupation}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="father_phone" className="block text-sm font-medium text-gray-700">
                Téléphone du père
              </label>
              <input
                id="father_phone"
                name="father_phone"
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="0600000000"
                value={formData.father_phone}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="mother_phone" className="block text-sm font-medium text-gray-700">
                Téléphone de la mère
              </label>
              <input
                id="mother_phone"
                name="mother_phone"
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="0600000000"
                value={formData.mother_phone}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Adresse de résidence
              </label>
              <textarea
                id="address"
                name="address"
                required
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="Adresse complète"
                value={formData.address}
                onChange={handleChange}
                disabled={isLoading}
              ></textarea>
            </div>

            {/* Situation familiale */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Situation familiale
              </label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    id="with_parents"
                    name="family_status"
                    type="radio"
                    value="with_parents"
                    checked={formData.family_status === "with_parents"}
                    onChange={handleChange}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                  />
                  <label htmlFor="with_parents" className="ml-3 block text-sm text-gray-700">
                    Vit avec les parents
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="divorced"
                    name="family_status"
                    type="radio"
                    value="divorced"
                    checked={formData.family_status === "divorced"}
                    onChange={handleChange}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                  />
                  <label htmlFor="divorced" className="ml-3 block text-sm text-gray-700">
                    Parents divorcés
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="orphaned"
                    name="family_status"
                    type="radio"
                    value="orphaned"
                    checked={formData.family_status === "orphaned"}
                    onChange={handleChange}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                  />
                  <label htmlFor="orphaned" className="ml-3 block text-sm text-gray-700">
                    Orphelin
                  </label>
                </div>
              </div>
            </div>

            {/* Champ de date orphelin (conditionnel) */}
            {formData.family_status === "orphaned" && (
              <div>
                <label htmlFor="orphan_date" className="block text-sm font-medium text-gray-700">
                  Date de décès du père
                </label>
                <input
                  id="orphan_date"
                  name="orphan_date"
                  type="date"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  value={formData.orphan_date}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Notes supplémentaires et téléchargement de fichiers */}
            <div>
              <label htmlFor="additional_notes" className="block text-sm font-medium text-gray-700">
                Notes complémentaires
              </label>
              <textarea
                id="additional_notes"
                name="additional_notes"
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="Informations supplémentaires importantes"
                value={formData.additional_notes}
                onChange={handleChange}
                disabled={isLoading}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Documents justificatifs (optionnel)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-orange-50 file:text-orange-700
                  hover:file:bg-orange-100"
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Vous pouvez télécharger des documents justificatifs tels qu'un relevé de notes ou un certificat scolaire (PDF, JPG, PNG, DOC).
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              Je confirme que toutes les informations fournies sont correctes et complètes
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              disabled={isLoading}
            >
              {isLoading ? "Soumission en cours..." : "Soumettre la demande d'inscription"}
            </button>
          </div>
          
          {/* Bouton de téléchargement PDF déplacé en bas */}
          {success && registrationId && (
            <div className="mt-6 text-center">
              <button
                onClick={handleDownloadPDF}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Télécharger le formulaire d'inscription (PDF)
              </button>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}