/**
 * ImageUnity - A unified solution for image handling in React components
 * This utility handles different image path formats and provides fallback mechanisms
 */

export const ImageUnity = {
  /**
   * Get a properly formatted image URL regardless of the path format
   * @param {string} path - The image path or URL
   * @returns {string|null} - Properly formatted URL or null if path is empty
   */
  getImageUrl: (path) => {
    if (!path) return null;
    
    // Direct URL case (already full URL)
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // Get the base URL from environment or fallback to window origin
    const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
    
    // Handle /storage/ paths which are common in Laravel applications
    if (path.startsWith('/storage/')) {
      // Remove the leading slash to avoid double slashes in URL
      return `${baseUrl}${path}`;
    }
    
    // If path starts with storage/ without leading slash
    if (path.startsWith('storage/')) {
      return `${baseUrl}/${path}`;
    }
    
    // Default case - assume it's a relative path that needs the storage prefix
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${baseUrl}/storage/${cleanPath}`;
  },
  
  /**
   * Create a placeholder image with initials when real image fails to load
   * @param {string} name - The name to extract initials from
   * @returns {string} - Data URL of SVG placeholder image
   */
  createPlaceholder: (name) => {
    const initial = name && name.length > 0 ? name.charAt(0).toUpperCase() : "?";
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='36' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3E${initial}%3C/text%3E%3C/svg%3E`;
  },
  
  /**
   * Format a numeric mark value to properly display decimals
   * @param {number|string} mark - The mark value to format
   * @returns {string} - Formatted mark value
   */
  formatMark: (mark) => {
    const numMark = parseFloat(mark);
    // Show decimal places only when needed
    return numMark % 1 === 0 ? numMark.toFixed(0) : numMark.toFixed(2);
  }
};

export default ImageUnity;