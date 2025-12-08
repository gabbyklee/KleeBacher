import Parse from "parse";

/**
 * Send a friend request to another user
 */
export const sendFriendRequest = async (toUserId) => {
  const FriendRequest = Parse.Object.extend("FriendRequest");
  const friendRequest = new FriendRequest();
  
  const currentUser = Parse.User.current();
  if (!currentUser) {
    throw new Error("Must be logged in to send friend requests");
  }
  
  // Check if request already exists
  const existingQuery = new Parse.Query("FriendRequest");
  existingQuery.equalTo("fromUser", currentUser);
  existingQuery.equalTo("toUserId", toUserId);
  existingQuery.equalTo("status", "pending");
  
  const existing = await existingQuery.first();
  if (existing) {
    alert("Friend request already sent!");
    return null;
  }
  
  // Check if they're already friends
  const areFriends = await checkIfFriends(toUserId);
  if (areFriends) {
    alert("You are already friends with this user!");
    return null;
  }
  
  friendRequest.set("fromUser", currentUser);
  friendRequest.set("toUserId", toUserId);
  friendRequest.set("status", "pending");
  
  try {
    const result = await friendRequest.save();
    return result;
  } catch (error) {
    console.error("Error sending friend request:", error);
    throw error;
  }
};

/**
 * Accept a friend request
 */
export const acceptFriendRequest = async (requestId) => {
  const query = new Parse.Query("FriendRequest");
  
  try {
    const request = await query.get(requestId);
    request.set("status", "accepted");
    await request.save();
    
    // Create friendship entries for both users
    await createFriendship(request.get("fromUser").id, request.get("toUserId"));
    
    return request;
  } catch (error) {
    console.error("Error accepting friend request:", error);
    throw error;
  }
};

/**
 * Reject a friend request
 */
export const rejectFriendRequest = async (requestId) => {
  const query = new Parse.Query("FriendRequest");
  
  try {
    const request = await query.get(requestId);
    request.set("status", "rejected");
    await request.save();
    return request;
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    throw error;
  }
};

/**
 * Create friendship entries
 */
const createFriendship = async (userId1, userId2) => {
  const Friendship = Parse.Object.extend("Friendship");
  
  // Create friendship for user 1
  const friendship1 = new Friendship();
  const user1 = new Parse.User();
  user1.id = userId1;
  const user2 = new Parse.User();
  user2.id = userId2;
  
  friendship1.set("user", user1);
  friendship1.set("friendId", userId2);
  
  // Create friendship for user 2
  const friendship2 = new Friendship();
  friendship2.set("user", user2);
  friendship2.set("friendId", userId1);
  
  try {
    await Parse.Object.saveAll([friendship1, friendship2]);
  } catch (error) {
    console.error("Error creating friendship:", error);
    throw error;
  }
};

/**
 * Get pending friend requests for current user
 */
export const getPendingFriendRequests = async () => {
  const currentUser = Parse.User.current();
  if (!currentUser) return [];
  
  const query = new Parse.Query("FriendRequest");
  query.equalTo("toUserId", currentUser.id);
  query.equalTo("status", "pending");
  query.include("fromUser");
  query.descending("createdAt");
  
  try {
    const results = await query.find();
    return results;
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    return [];
  }
};

/**
 * Get list of friends for current user
 */
export const getFriends = async () => {
  const currentUser = Parse.User.current();
  if (!currentUser) return [];
  
  const query = new Parse.Query("Friendship");
  query.equalTo("user", currentUser);
  
  try {
    const friendships = await query.find();
    
    // Fetch user details for all friends
    const friendIds = friendships.map(f => f.get("friendId"));
    
    if (friendIds.length === 0) return [];
    
    const userQuery = new Parse.Query(Parse.User);
    userQuery.containedIn("objectId", friendIds);
    
    const friends = await userQuery.find();
    
    return friends.map(friend => ({
      id: friend.id,
      username: friend.get("username"),
      firstName: friend.get("firstName"),
      lastName: friend.get("lastName"),
      profilePicture: friend.get("profilePicture") || ""
    }));
  } catch (error) {
    console.error("Error fetching friends:", error);
    return [];
  }
};

/**
 * Check if two users are friends
 */
export const checkIfFriends = async (userId) => {
  const currentUser = Parse.User.current();
  if (!currentUser) return false;
  
  const query = new Parse.Query("Friendship");
  query.equalTo("user", currentUser);
  query.equalTo("friendId", userId);
  
  try {
    const count = await query.count();
    return count > 0;
  } catch (error) {
    console.error("Error checking friendship:", error);
    return false;
  }
};

/**
 * Remove a friend
 */
export const removeFriend = async (friendId) => {
  const currentUser = Parse.User.current();
  if (!currentUser) return;
  
  // Delete both friendship entries
  const query1 = new Parse.Query("Friendship");
  query1.equalTo("user", currentUser);
  query1.equalTo("friendId", friendId);
  
  const user = new Parse.User();
  user.id = friendId;
  
  const query2 = new Parse.Query("Friendship");
  query2.equalTo("user", user);
  query2.equalTo("friendId", currentUser.id);
  
  try {
    const friendship1 = await query1.first();
    const friendship2 = await query2.first();
    
    const toDelete = [friendship1, friendship2].filter(f => f);
    
    if (toDelete.length > 0) {
      await Parse.Object.destroyAll(toDelete);
    }
  } catch (error) {
    console.error("Error removing friend:", error);
    throw error;
  }
};

/**
 * Search for users (excluding current user and existing friends)
 */
export const searchUsersForFriends = async (searchTerm) => {
  const currentUser = Parse.User.current();
  if (!currentUser) return [];
  
  const query = new Parse.Query(Parse.User);
  
  // Search by username using startsWith (case insensitive)
  query.startsWith("username", searchTerm);
  
  // Exclude current user
  query.notEqualTo("objectId", currentUser.id);
  
  // Only get users that have a username set
  query.exists("username");
  
  query.limit(10);
  
  try {
    const results = await query.find();
    console.log("Search results:", results.length, "users found");
    console.log("Raw results:", results);
    
    return results.map(user => ({
      id: user.id,
      username: user.get("username") || "unknown",
      firstName: user.get("firstName") || "",
      lastName: user.get("lastName") || "",
      profilePicture: user.get("profilePicture") || ""
    }));
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
};