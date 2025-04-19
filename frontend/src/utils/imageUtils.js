export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  const url = `${import.meta.env.VITE_API_URL}/storage/${imagePath}`;
  console.log("Image URL:", url); // Add this to see what URL is being generated
  return url;
};