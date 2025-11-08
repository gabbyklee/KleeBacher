import Parse from 'parse';

/**
 * PLACEHOLDER 
 */

// Placeholder: Always returns false for now
export const checkUser = () => {
  console.log("Using placeholder checkUser - always returns false");
  return false;  // No one is logged in yet
};

// Placeholder: Not implemented yet
export const createUser = async (newUser) => {
  console.log("Placeholder createUser called - not yet implemented");
  alert("Registration not yet implemented by Student B");
  return null;
};

// Placeholder: Not implemented yet
export const loginUser = async (currUser) => {
  console.log("Placeholder loginUser called - not yet implemented");
  alert("Login not yet implemented by Student B");
  return null;
};

// Placeholder: Not implemented yet
export const logoutUser = async () => {
  console.log("Placeholder logoutUser called - not yet implemented");
  return { success: true };
};