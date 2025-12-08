import Parse from "parse";

// Check if username is already taken
export const checkUsernameAvailability = async (username) => {
  const query = new Parse.Query(Parse.User);
  query.equalTo("username", username);
  
  try {
    const count = await query.count();
    return count === 0; // true if available, false if taken
  } catch (error) {
    console.error("Error checking username:", error);
    return false;
  }
};

// used in auth register component
export const createUser = async (newUser) => {
  // Check if username is available
  const isAvailable = await checkUsernameAvailability(newUser.username);
  
  if (!isAvailable) {
    alert("Username is already taken. Please choose another one.");
    return null;
  }
  
  const user = new Parse.User();

  user.set("username", newUser.username);
  user.set("firstName", newUser.firstName);
  user.set("lastName", newUser.lastName);
  user.set("password", newUser.password);
  user.set("email", newUser.email);
  user.set("profilePicture", ""); // Default empty profile picture
  user.set("reviewsAnonymous", false); // Default to showing username in reviews

  // Set ACL to allow public read access
  const acl = new Parse.ACL();
  acl.setPublicReadAccess(true);  // Everyone can read this user's profile
  acl.setPublicWriteAccess(false); // But only the user can write
  user.setACL(acl);

  console.log("User: ", user);
  return user
    .signUp()
    .then((newUserSaved) => {
      return newUserSaved;
    })
    .catch((error) => {
      alert(`Error: ${error.message}`);
      return null;
    });
};

// used in auth login component
export const loginUser = (currUser) => {
  return Parse.User.logIn(currUser.email, currUser.password)
    .then((currUserSaved) => {
      return currUserSaved;
    })
    .catch((error) => {
      alert(`Error: ${error.message}`);
      return null;
    });
};

// used in auth module component
export const checkUser = () => {
  return Parse.User.current()?.authenticated;
};

// Update user profile
export const updateUserProfile = async (updates) => {
  const currentUser = Parse.User.current();
  
  if (!currentUser) {
    alert("No user logged in");
    return null;
  }
  
  // If updating username, check availability
  if (updates.username && updates.username !== currentUser.get("username")) {
    const isAvailable = await checkUsernameAvailability(updates.username);
    if (!isAvailable) {
      alert("Username is already taken. Please choose another one.");
      return null;
    }
  }
  
  try {
    // Update fields
    if (updates.username) currentUser.set("username", updates.username);
    if (updates.profilePicture !== undefined) currentUser.set("profilePicture", updates.profilePicture);
    if (updates.reviewsAnonymous !== undefined) currentUser.set("reviewsAnonymous", updates.reviewsAnonymous);
    
    const result = await currentUser.save();
    return result;
  } catch (error) {
    console.error("Error updating profile:", error);
    alert(`Error updating profile: ${error.message}`);
    return null;
  }
};

// Search for users by username
export const searchUsers = async (searchTerm) => {
  const query = new Parse.Query(Parse.User);
  query.matches("username", searchTerm, "i"); // Case-insensitive search
  query.limit(10); // Limit results
  
  try {
    const results = await query.find();
    return results.map(user => ({
      id: user.id,
      username: user.get("username"),
      firstName: user.get("firstName"),
      lastName: user.get("lastName"),
      profilePicture: user.get("profilePicture")
    }));
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
};