import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ImageModal({ isOpen, imageUrl, imageAlt, onClose }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
      <div className="relative max-w-full max-h-full flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
          aria-label="Close image"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Image Container with Border Removed */}
        <div className="overflow-auto bg-black rounded flex items-center justify-center">
          <img
            src={imageUrl}
            alt={imageAlt || "Full size image"}
            className="max-h-[90vh] object-contain"
            style={{ 
              maxWidth: '90vw',
              height: 'auto',
              width: 'auto',
              minWidth: '400px', 
              minHeight: '300px' 
            }}
          />
        </div>
      </div>
    </div>
  );
}