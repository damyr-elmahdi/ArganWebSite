export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Get the API URL from environment, fallback to current origin if not available
  const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
  
  // Handle both paths with and without leading slash
  const path = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  
  return `${baseUrl}/storage/${path}`;
};