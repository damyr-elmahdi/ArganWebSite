export const getImageUrl = (imagePath) => {
   if (!imagePath) return null;
   return `${process.env.REACT_APP_API_URL}/storage/${imagePath}`;
 };