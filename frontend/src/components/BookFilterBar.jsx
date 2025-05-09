import React from 'react';
import { useTranslation } from 'react-i18next';

export default function BookFilterBar({ categories, filters, onFilterChange }) {
  const { t } = useTranslation();

  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };
  
  const handleCategoryChange = (e) => {
    onFilterChange({ category: e.target.value });
  };
  
  const handleSortByChange = (e) => {
    onFilterChange({ sort_by: e.target.value });
  };
  
  const handleSortDirChange = (e) => {
    onFilterChange({ sort_dir: e.target.value });
  };
  
  const handleClearFilters = () => {
    onFilterChange({ 
      search: '', 
      category: '', 
      sort_by: 'inventory_number', 
      sort_dir: 'asc' 
    });
  };
  
  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-grow">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            {t('bookFilter.search')}
          </label>
          <input
            type="text"
            id="search"
            placeholder={t('bookFilter.searchPlaceholder')}
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="md:w-1/4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            {t('bookFilter.category')}
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={handleCategoryChange}
            className="w-full p-2 border rounded"
          >
            <option value="">{t('bookFilter.allCategories')}</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/4">
          <label htmlFor="sort_by" className="block text-sm font-medium text-gray-700 mb-1">
            {t('bookFilter.sortBy')}
          </label>
          <select
            id="sort_by"
            value={filters.sort_by || 'inventory_number'}
            onChange={handleSortByChange}
            className="w-full p-2 border rounded"
          >
            <option value="inventory_number">{t('bookFilter.sortOptions.inventoryNumber')}</option>
            <option value="title">{t('bookFilter.sortOptions.title')}</option>
            <option value="author">{t('bookFilter.sortOptions.author')}</option>
            <option value="category">{t('bookFilter.sortOptions.category')}</option>
            <option value="created_at">{t('bookFilter.sortOptions.dateAdded')}</option>
          </select>
        </div>

        <div className="md:w-1/4">
          <label htmlFor="sort_dir" className="block text-sm font-medium text-gray-700 mb-1">
            {t('bookFilter.sortDirection')}
          </label>
          <select
            id="sort_dir"
            value={filters.sort_dir || 'asc'}
            onChange={handleSortDirChange}
            className="w-full p-2 border rounded"
          >
            <option value="asc">{t('bookFilter.sortDirectionOptions.ascending')}</option>
            <option value="desc">{t('bookFilter.sortDirectionOptions.descending')}</option>
          </select>
        </div>
        
        <div className="self-end ml-auto">
          <button
            onClick={handleClearFilters}
            className="p-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            {t('bookFilter.clearFilters')}
          </button>
        </div>
      </div>
    </div>
  );
}