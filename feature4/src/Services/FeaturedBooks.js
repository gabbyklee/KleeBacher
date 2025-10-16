import axios from 'axios';

export const getFeaturedBooks = async () => {
  try {
    // In React (Create React App), files in the public folder are accessed from root
    const response = await axios.get('/Services/featuredbooks.json');
    console.log('Books loaded:', response.data);
    return response.data;
  } catch (err) {
    console.error("GET Error: ", err);
    throw err; // Re-throw so components can handle the error
  }
};