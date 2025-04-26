import React, { useState } from "react";
import axios from "axios";
import { Pencil, Trash2, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getImageUrl } from "../utils/imageUtils";
import ImageModal from "./ImageModal";

export default function BookCard({
  book,
  isLibrarian,
  onBookDeleted,
  onBookUpdated,
}) {
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
      setError(error.response?.data?.message || 'Failed to delete book');
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

      setSuccess("Book updated successfully!");
      
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
      setError(error.response?.data?.message || "Error updating book");
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
          <span className="text-gray-500">No image available</span>
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
                Change Image
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
                  <p className="text-xs text-gray-500">New image preview:</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 object-contain mt-1"
                  />
                </div>
              )}

              {!imagePreview && book.image_path && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Current image:</p>
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
                Title
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
                Author
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
                Category
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
                Quantity
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
                Inventory Number
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
                Description
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
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 text-white rounded"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">{book.title}</h3>
            <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500">#{book.inventory_number}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                {book.quantity} in inventory
              </span>
            </div>

            <p className="text-sm text-gray-700 mb-4 line-clamp-3">
              {book.description || "No description available."}
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
                {showDetails ? "Hide Details" : "Show Details"}
              </button>

              {isLibrarian && (
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

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
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            </div>
            
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete "{book.title}"? This action cannot be undone.
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
                Cancel
              </button>
              
              <button 
                onClick={handleDeleteBook}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}