import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  searchUsersForFriends,
  sendFriendRequest,
  getPendingFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  removeFriend,
  checkIfFriends
} from "../../Common/Services/FriendService";
import Parse from "parse";
import "./Friends.css";

const Friends = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("search");
  const [friendStatus, setFriendStatus] = useState({});

  useEffect(() => {
    const currentUser = Parse.User.current();
    if (!currentUser || !currentUser.authenticated) {
      setLoading(false);
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [requests, friendsList] = await Promise.all([
        getPendingFriendRequests(),
        getFriends()
      ]);
      setFriendRequests(requests);
      setFriends(friendsList);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    console.log("Searching for:", value);

    try {
      const results = await searchUsersForFriends(value);
      console.log("Search returned:", results);
      setSearchResults(results);
      
      const statusMap = {};
      for (const user of results) {
        statusMap[user.id] = await checkIfFriends(user.id);
      }
      setFriendStatus(statusMap);
    } catch (error) {
      console.error("Error searching users:", error);
      alert("Error searching users: " + error.message);
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      await sendFriendRequest(userId);
      alert("Friend request sent!");
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await acceptFriendRequest(requestId);
      alert("Friend request accepted!");
      loadData();
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await rejectFriendRequest(requestId);
      alert("Friend request rejected");
      loadData();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (!window.confirm("Are you sure you want to remove this friend?")) {
      return;
    }

    try {
      await removeFriend(friendId);
      alert("Friend removed");
      loadData();
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  if (loading) {
    return (
      <div className="main-content" style={{ textAlign: "center", color: "white" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  const currentUser = Parse.User.current();
  if (!currentUser || !currentUser.authenticated) {
    return (
      <div className="main-content">
        <section className="hero-section">
          <h1>Find Friends</h1>
          <p>Connect with other readers and share your literary journey</p>
        </section>
        
        <div className="friends-login-prompt">
          <h2>Please Log In</h2>
          <p>You need to be logged in to search for friends and manage friend requests.</p>
          
          <div className="friends-login-buttons">
            <button onClick={() => navigate("/auth")} className="friends-login-btn login">
              Log In
            </button>
            <button onClick={() => navigate("/auth/register")} className="friends-login-btn register">
              Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <section className="hero-section">
        <h1>Find Friends</h1>
        <p>Connect with other readers and share your literary journey</p>
      </section>

      {/* Tab Navigation */}
      <div className="friends-tabs">
        <button
          onClick={() => setActiveTab("search")}
          className={`friends-tab-btn ${activeTab === "search" ? "active" : "inactive"}`}
        >
          🔍 Search Users
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`friends-tab-btn ${activeTab === "requests" ? "active" : "inactive"}`}
        >
          📬 Requests
          {friendRequests.length > 0 && (
            <span className="friends-tab-badge">{friendRequests.length}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("friends")}
          className={`friends-tab-btn ${activeTab === "friends" ? "active" : "inactive"}`}
        >
          👥 My Friends ({friends.length})
        </button>
      </div>

      {/* Search Tab */}
      {activeTab === "search" && (
        <div className="friends-content-container">
          <h2>Search for Users</h2>
          
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by username..."
            className="friends-search-input"
          />

          {searchResults.length > 0 && (
            <div>
              {searchResults.map(user => (
                <div key={user.id} className="friends-user-card">
                  <div className="friends-user-info">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="friends-user-avatar"
                      />
                    ) : (
                      <div className="friends-user-avatar-placeholder">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="friends-user-details">
                      <strong>@{user.username}</strong>
                      <p>{user.firstName} {user.lastName}</p>
                    </div>
                  </div>
                  
                  {friendStatus[user.id] ? (
                    <span className="friends-friend-status">✓ Friends</span>
                  ) : (
                    <button
                      onClick={() => handleSendRequest(user.id)}
                      className="friends-add-friend-btn"
                    >
                      Add Friend
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {searchTerm.length >= 2 && searchResults.length === 0 && (
            <p className="friends-no-results">
              No users found matching "{searchTerm}"
            </p>
          )}
        </div>
      )}

      {/* Friend Requests Tab */}
      {activeTab === "requests" && (
        <div className="friends-content-container">
          <h2>Friend Requests</h2>

          {friendRequests.length === 0 ? (
            <p className="friends-no-results">No pending friend requests</p>
          ) : (
            friendRequests.map(request => {
              const fromUser = request.get("fromUser");
              return (
                <div key={request.id} className="friends-user-card">
                  <div className="friends-user-info">
                    {fromUser.get("profilePicture") ? (
                      <img
                        src={fromUser.get("profilePicture")}
                        alt={fromUser.get("username")}
                        className="friends-user-avatar"
                      />
                    ) : (
                      <div className="friends-user-avatar-placeholder">
                        {fromUser.get("username").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="friends-user-details">
                      <strong>@{fromUser.get("username")}</strong>
                      <p>{fromUser.get("firstName")} {fromUser.get("lastName")}</p>
                    </div>
                  </div>

                  <div className="friends-request-actions">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="friends-accept-btn"
                    >
                      ✓ Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="friends-reject-btn"
                    >
                      ✗ Reject
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Friends List Tab */}
      {activeTab === "friends" && (
        <div className="friends-content-container">
          <h2>My Friends ({friends.length})</h2>

          {friends.length === 0 ? (
            <p className="friends-no-results">
              You haven't added any friends yet. Search for users to get started!
            </p>
          ) : (
            <div className="friends-friends-grid">
              {friends.map(friend => (
                <div key={friend.id} className="friends-friend-card">
                  {friend.profilePicture ? (
                    <img
                      src={friend.profilePicture}
                      alt={friend.username}
                      className="friends-friend-avatar"
                    />
                  ) : (
                    <div className="friends-friend-avatar-placeholder">
                      {friend.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <strong>@{friend.username}</strong>
                  <p>{friend.firstName} {friend.lastName}</p>
                  <button
                    onClick={() => handleRemoveFriend(friend.id)}
                    className="friends-remove-friend-btn"
                  >
                    Remove Friend
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Friends;