export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  // Change from process.env to import.meta.env for Vite
  return `${import.meta.env.VITE_API_URL}/storage/${imagePath}`;
};