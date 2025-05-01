import React, { useState } from 'react';
import ResourceUploader from '../components/ResourceUploader';
import ResourceViewer from '../components/ResourceViewer';

export default function TeacherResourceDashboard() {
  const [activeView, setActiveView] = useState('upload'); // 'upload' or 'view'

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Educational Resources</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView('upload')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeView === 'upload'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Upload Resources
          </button>
          <button
            onClick={() => setActiveView('view')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeView === 'view'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            View Resources
          </button>
        </div>
      </div>
      
      {activeView === 'upload' ? <ResourceUploader /> : <ResourceViewer />}
    </div>
  );
}