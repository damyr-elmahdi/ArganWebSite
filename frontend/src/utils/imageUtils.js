export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  return `${import.meta.env.VITE_API_URL}/storage/${imagePath}`;
};