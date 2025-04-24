import React from 'react';

export default function BookFilterBar({ categories, filters, onFilterChange }) {
  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };
  
  const handleCategoryChange = (e) => {
    onFilterChange({ category: e.target.value });
  };
  
  const handleClearFilters = () => {
    onFilterChange({ search: '', category: '' });
  };
  
  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search by title, author or inventory #"
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="md:w-1/4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={handleCategoryChange}
            className="w-full p-2 border rounded"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        <div className="self-end">
          <button
            onClick={handleClearFilters}
            className="p-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}