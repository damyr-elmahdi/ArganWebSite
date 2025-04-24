import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import BookCard from '../components/BookCard';
import BookFilterBar from '../components/BookFilterBar';
import LibrarianDashboard from './LibrarianDashboard';
import NewBookForm from '../components/NewBookForm';
import StudentBorrowingsTable from '../components/StudentBorrowingsTable';

export default function Library() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: ''
  });
  const [activeTab, setActiveTab] = useState('catalog');
  
  useEffect(() => {
    if (activeTab === 'catalog') {
      fetchBooks();
      fetchCategories();
    }
  }, [filters, activeTab]);
  
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      
      const response = await axios.get('/api/library', { params });
      setBooks(response.data.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/library/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };
  
  const handleBookCreated = () => {
    fetchBooks();
    setActiveTab('catalog');
  };
  
  const handleBookDeleted = () => {
    fetchBooks();
  };
  
  const isLibrarian = user && (user.role === 'librarian' || user.role === 'administrator');
  const isStudent = user && user.role === 'student';
  
  return (
    <main className="flex-grow container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Library</h1>
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded ${activeTab === 'catalog' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Book Catalog
          </button>
          
          {isStudent && (
            <button
              onClick={() => setActiveTab('myBorrowings')}
              className={`px-4 py-2 rounded ${activeTab === 'myBorrowings' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              My Borrowings
            </button>
          )}
          
          {isLibrarian && (
            <>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                Librarian Dashboard
              </button>
              <button
                onClick={() => setActiveTab('add')}
                className={`px-4 py-2 rounded ${activeTab === 'add' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                Add New Book
              </button>
            </>
          )}
        </div>
      </div>
      
      {activeTab === 'dashboard' && isLibrarian && <LibrarianDashboard />}
      {activeTab === 'myBorrowings' && isStudent && <StudentBorrowingsTable />}
      {activeTab === 'add' && isLibrarian && <NewBookForm onBookCreated={handleBookCreated} />}
      
      {activeTab === 'catalog' && (
        <>
          <BookFilterBar 
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.length > 0 ? (
                books.map(book => (
                  <BookCard 
                    key={book.id} 
                    book={book}
                    isLibrarian={isLibrarian}
                    isStudent={isStudent}
                    onBookDeleted={handleBookDeleted}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No books found matching your search criteria.
                </div>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}