import { useState } from 'react';
import { ImageUnity } from '../utils/ImageUnity';

export default function ImageDebugger() {
  const [imagePath, setImagePath] = useState('/storage/student_photos/example.jpg');
  const [resolvedUrl, setResolvedUrl] = useState('');
  
  const checkImage = () => {
    const url = ImageUnity.getImageUrl(imagePath);
    setResolvedUrl(url);
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-bold mb-4">Image Path Debugger</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Enter image path:
        </label>
        <input
          type="text"
          value={imagePath}
          onChange={(e) => setImagePath(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
      
      <button
        onClick={checkImage}
        className="px-4 py-2 bg-teal-600 text-white rounded-md mb-4 hover:bg-teal-700"
      >
        Resolve URL
      </button>
      
      {resolvedUrl && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Resolved URL:</h3>
          <div className="p-2 bg-gray-100 rounded-md break-all mb-4">
            {resolvedUrl}
          </div>
          
          <h3 className="font-semibold mb-2">Image preview:</h3>
          <div className="border rounded-md p-2 bg-gray-50">
            <img
              src={resolvedUrl}
              alt="Preview"
              className="max-h-64 mx-auto"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = ImageUnity.createPlaceholder("Image Not Found");
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}