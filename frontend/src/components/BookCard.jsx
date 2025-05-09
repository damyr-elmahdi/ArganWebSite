import React, { useState } from "react";
import axios from "axios";
import { Pencil, Trash2, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getImageUrl } from "../utils/imageUtils";
import ImageModal from "./ImageModal";
import BorrowBookButton from "./BorrowBookButton";
import { useTranslation } from "react-i18next"; // Import useTranslation hook

export default function BookCard({
  book,
  isLibrarian,
  onBookDeleted,
  onBookUpdated,
  onBookBorrowed,
}) {
  const { t } = useTranslation(); // Initialize the translation function
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Initialize form data with book values
  const [formData, setFormData] = useState({
    title: book.title,
    author: book.author,
    category: book.category,
    quantity: book.quantity,
    inventory_number: book.inventory_number,
    description: book.description || "",
    image: null,
  });

  const handleDeleteBook = async () => {
    try {
      setDeleteLoading(true);
      await axios.delete(`/api/library/${book.id}`);
      if (onBookDeleted) {
        onBookDeleted();
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      setError(error.response?.data?.message || t('bookCard.errors.deleteFailure'));
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      // Create image preview
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "quantity" ? parseInt(value) : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Create FormData object for file upload
      const form = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === "image" && formData[key]) {
          form.append(key, formData[key]);
        } else if (formData[key] !== null && key !== "image") {
          form.append(key, formData[key]);
        }
      });

      // Log the form data for debugging
      console.log("Submitting update with form data:");
      for (let [key, value] of form.entries()) {
        if (key !== 'image') {
          console.log(`${key}: ${value}`);
        } else {
          console.log(`${key}: [File object]`);
        }
      }

      // Make the API request with proper headers
      const response = await axios.post(`/api/library/${book.id}?_method=PUT`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-HTTP-Method-Override": "PUT"
        },
      });

      setSuccess(t('bookCard.messages.updateSuccess'));
      
      // Update local state after successful update
      setTimeout(() => {
        setSuccess(null);
        setIsEditing(false);
        setImagePreview(null);

        // Call parent's update function with the updated book data
        if (typeof onBookUpdated === "function") {
          onBookUpdated(response.data);
        }
      }, 2000);
    } catch (error) {
      console.error("Error updating book:", error);
      setError(error.response?.data?.message || t('bookCard.errors.updateFailure'));
    } finally {
      setLoading(false);
    }
  };

  // Get the correct image URL
  const bookImageUrl = book.image_path ? getImageUrl(book.image_path) : null;
  
  const openImageModal = () => {
    if (bookImageUrl) {
      setIsImageModalOpen(true);
    }
  };
  
  return (
    <div className="border rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow">
      {bookImageUrl ? (
        <div className="cursor-pointer" onClick={openImageModal}>
          <img
            src={bookImageUrl}
            alt={book.title}
            className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/400x200?text=No+Image";
            }}
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">{t('bookCard.noImage')}</span>
        </div>
      )}

      <ImageModal
        isOpen={isImageModalOpen}
        imageUrl={bookImageUrl}
        imageAlt={book.title}
        onClose={() => setIsImageModalOpen(false)}
      />

      <div className="p-4">
        {isEditing ? (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">
                {t('bookCard.form.changeImage')}
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleInputChange}
                className="mt-1 block w-full border rounded-md p-2"
              />

              {imagePreview && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">{t('bookCard.form.newImagePreview')}</p>
                  <img
                    src={imagePreview}
                    alt={t('bookCard.form.preview')}
                    className="h-32 object-contain mt-1"
                  />
                </div>
              )}

              {!imagePreview && book.image_path && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">{t('bookCard.form.currentImage')}</p>
                  <img
                    src={bookImageUrl}
                    alt={book.title}
                    className="h-32 object-contain mt-1"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/400x200?text=No+Image";
                    }}
                  />
                </div>
              )}
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">
                {t('bookCard.form.title')}
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">
                {t('bookCard.form.author')}
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">
                {t('bookCard.form.category')}
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">
                {t('bookCard.form.quantity')}
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="mt-1 block w-full border rounded-md p-2"
                min="1"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">
                {t('bookCard.form.inventoryNumber')}
              </label>
              <input
                type="text"
                name="inventory_number"
                value={formData.inventory_number}
                onChange={handleInputChange}
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">
                {t('bookCard.form.description')}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full border rounded-md p-2"
                rows="3"
              />
            </div>

            {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
            {success && (
              <div className="text-green-500 text-sm mb-3">{success}</div>
            )}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setImagePreview(null);
                  setFormData({
                    title: book.title,
                    author: book.author,
                    category: book.category,
                    quantity: book.quantity,
                    inventory_number: book.inventory_number,
                    description: book.description || "",
                    image: null,
                  });
                }}
                className="px-3 py-1 bg-gray-300 rounded"
                disabled={loading}
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 text-white rounded"
                disabled={loading}
              >
                {loading ? t('common.saving') : t('common.saveChanges')}
              </button>
            </div>
          </form>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">{book.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{t('bookCard.byAuthor', { author: book.author })}</p>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500">#{book.inventory_number}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                book.quantity > 0 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
              }`}>
                {book.quantity > 0 
                  ? t('bookCard.inventory', { count: book.quantity }) 
                  : t('bookCard.outOfStock')}
              </span>
            </div>

            <p className="text-sm text-gray-700 mb-4 line-clamp-3">
              {book.description || t('bookCard.noDescription')}
            </p>

            {showDetails && book.description && (
              <div className="mt-3 text-sm text-gray-700">
                <p>{book.description}</p>
              </div>
            )}

            <div className="flex justify-between items-center mt-4">
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? t('bookCard.hideDetails') : t('bookCard.showDetails')}
              </button>

              {isLibrarian && (
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    title={t('bookCard.actions.edit')}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    title={t('bookCard.actions.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Add Borrow Book Button for students */}
            {book.quantity > 0 && (
              <BorrowBookButton 
                bookId={book.id}
                onBorrowed={onBookBorrowed}
              />
            )}

            {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
            {success && (
              <div className="mt-2 text-green-500 text-sm">{success}</div>
            )}
          </>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex items-center text-red-600 mb-4">
              <AlertCircle className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-semibold">{t('bookCard.deleteModal.title')}</h3>
            </div>
            
            <p className="mb-4 text-gray-700">
              {t('bookCard.deleteModal.confirmMessage', { title: book.title })}
            </p>
            
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
                {error}
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={deleteLoading}
              >
                {t('common.cancel')}
              </button>
              
              <button 
                onClick={handleDeleteBook}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    {t('common.deleting')}
                  </>
                ) : (
                  t('common.delete')
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}