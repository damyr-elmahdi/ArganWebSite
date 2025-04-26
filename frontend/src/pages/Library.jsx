import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import BookCard from "../components/BookCard";
import BookFilterBar from "../components/BookFilterBar";
import LibrarianDashboard from "./LibrarianDashboard";
import NewBookForm from "../components/NewBookForm";
import StudentBorrowingsTable from "../components/StudentBorrowingsTable";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Library() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sort_by: "inventory_number", // Default sort by inventory_number
    sort_dir: "asc", // Default sort direction ascending
  });
  const [activeTab, setActiveTab] = useState("catalog");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const booksPerPage = 12;

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (activeTab === "catalog") {
      fetchBooks();
      fetchCategories();
    }
  }, [filters, activeTab, refreshTrigger, currentPage]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {
        sort_by: filters.sort_by || "inventory_number",
        sort_dir: filters.sort_dir || "asc",
        page: currentPage,
        per_page: booksPerPage
      };
      
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;

      console.log("Fetching books with params:", params);
      const response = await axios.get("/api/library", { params });
      console.log("Books received:", response.data);

      if (response.data.data) {
        setBooks(response.data.data); // If paginated response
        setTotalBooks(response.data.total || 0);
        setTotalPages(response.data.last_page || Math.ceil(response.data.total / booksPerPage) || 1);
      } else {
        setBooks(response.data); // If direct array response
        setTotalPages(Math.ceil(response.data.length / booksPerPage));
        setTotalBooks(response.data.length);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/library/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleBookCreated = async () => {
    console.log("Book created, refreshing list...");

    // Reset filters
    setFilters({
      search: "",
      category: "",
      sort_by: "inventory_number",
      sort_dir: "asc"
    });
    
    setCurrentPage(1); // Go back to first page
    
    try {
      setLoading(true);
      const response = await axios.get("/api/library", {
        params: {
          sort_by: "inventory_number",
          sort_dir: "asc",
          page: 1,
          per_page: booksPerPage
        }
      });
      console.log("Books received after creation:", response.data);

      if (response.data.data) {
        setBooks(response.data.data); // If paginated response
        setTotalBooks(response.data.total || 0);
        setTotalPages(response.data.last_page || Math.ceil(response.data.total / booksPerPage) || 1);
      } else {
        setBooks(response.data); // If direct array response
        setTotalPages(Math.ceil(response.data.length / booksPerPage));
        setTotalBooks(response.data.length);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
      setActiveTab("catalog");
    }
  };
  
  const handleBookDeleted = () => {
    fetchBooks();
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPagination = () => {
    // If there's only one page, don't render pagination
    if (totalPages <= 1) return null;

    // Determine which page numbers to show
    let pageNumbers = [];
    const maxPageButtons = 5;
    
    if (totalPages <= maxPageButtons) {
      // Show all pages if there are fewer than maxPageButtons
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page, last page, current page, and pages around current
      const startPage = Math.max(1, currentPage - 1);
      const endPage = Math.min(totalPages, currentPage + 1);
      
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center justify-center w-8 h-8 rounded ${
            currentPage === 1 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-blue-600 hover:bg-blue-50'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {pageNumbers.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2">...</span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-8 h-8 rounded ${
                currentPage === page 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          )
        ))}
        
        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center justify-center w-8 h-8 rounded ${
            currentPage === totalPages 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-blue-600 hover:bg-blue-50'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  const isLibrarian =
    user && (user.role === "librarian" || user.role === "administrator");
  const isStudent = user && user.role === "student";

  return (
    <main className="flex-grow container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Library</h1>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => {
              setActiveTab("catalog");
              setCurrentPage(1); // Reset to page 1 when switching tabs
            }}
            className={`px-4 py-2 rounded ${
              activeTab === "catalog" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Book Catalog
          </button>

          {isStudent && (
            <button
              onClick={() => setActiveTab("myBorrowings")}
              className={`px-4 py-2 rounded ${
                activeTab === "myBorrowings"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              My Borrowings
            </button>
          )}

          {isLibrarian && (
            <>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2 rounded ${
                  activeTab === "dashboard"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                Librarian Dashboard
              </button>
              <button
                onClick={() => setActiveTab("add")}
                className={`px-4 py-2 rounded ${
                  activeTab === "add" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                Add New Book
              </button>
            </>
          )}
        </div>
      </div>

      {activeTab === "dashboard" && isLibrarian && <LibrarianDashboard />}
      {activeTab === "myBorrowings" && isStudent && <StudentBorrowingsTable />}
      {activeTab === "add" && isLibrarian && (
        <NewBookForm onBookCreated={handleBookCreated} />
      )}

      {activeTab === "catalog" && (
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
            <>
              <div className="text-sm text-gray-600 mb-4">
                Showing {books.length} of {totalBooks} books
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books.length > 0 ? (
                  books.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      isLibrarian={isLibrarian}
                      isStudent={isStudent}
                      onBookDeleted={handleBookDeleted}
                      onBookUpdated={(updatedBook) => {
                        // Update the specific book in the list
                        setBooks((prevBooks) =>
                          prevBooks.map((b) =>
                            b.id === updatedBook.id ? updatedBook : b
                          )
                        );
                      }}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    No books found matching your search criteria.
                  </div>
                )}
              </div>

              {renderPagination()}
            </>
          )}
        </>
      )}
    </main>
  );
}