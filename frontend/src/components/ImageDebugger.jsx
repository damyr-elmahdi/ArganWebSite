import { useState } from 'react';

export default function ImageDebugger({ path }) {
  const [showDebug, setShowDebug] = useState(false);
  
  // Get various versions of the URL to see which one works
  const getUrlVariations = (path) => {
    if (!path) return [];
    
    const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
    const variations = [];
    
    // Original path
    variations.push({
      label: "Original path",
      url: path
    });
    
    // With base URL
    if (!path.startsWith('http')) {
      variations.push({
        label: "With base URL",
        url: `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`
      });
    }
    
    // With /storage/ prefix
    if (!path.includes('/storage/')) {
      variations.push({
        label: "With /storage/ prefix",
        url: `${baseUrl}/storage/${path.startsWith('/') ? path.substring(1) : path}`
      });
    }
    
    // Without /storage/ prefix if it exists
    if (path.includes('/storage/')) {
      const pathAfterStorage = path.split('/storage/')[1];
      variations.push({
        label: "Without /storage/ prefix",
        url: `${baseUrl}/${pathAfterStorage}`
      });
    }
    
    return variations;
  };
  
  const variations = getUrlVariations(path);
  
  return (
    <div className="mb-4">
      <button 
        onClick={() => setShowDebug(!showDebug)} 
        className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
      >
        {showDebug ? 'Hide' : 'Debug'} Image Path
      </button>
      
      {showDebug && (
        <div className="mt-2 p-3 bg-gray-100 rounded border border-gray-300 text-xs">
          <div className="mb-2">
            <strong>Original Path:</strong> {path || 'null'}
          </div>
          
          <div className="mb-2">
            <strong>Base URL:</strong> {import.meta.env.VITE_API_URL || window.location.origin}
          </div>
          
          <div className="mt-3 space-y-4">
            {variations.map((v, i) => (
              <div key={i} className="pb-2 border-b border-gray-200">
                <div><strong>{v.label}:</strong> {v.url}</div>
                <div className="mt-1">
                  <img 
                    src={v.url} 
                    alt={`Test ${i}`} 
                    className="h-8 w-8 object-cover rounded"
                    onError={(e) => {
                      e.target.style.border = '1px solid red';
                      e.target.style.backgroundColor = '#ffe6e6';
                      e.target.alt = 'Failed to load';
                    }}
                    onLoad={(e) => {
                      e.target.style.border = '1px solid green';
                      e.target.style.backgroundColor = '#e6ffe6';
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}