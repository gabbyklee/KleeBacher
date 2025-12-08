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
import "./Explore.css";

const Explore = () => {
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
        
        <div className="explore-login-prompt">
          <h2>Please Log In</h2>
          <p>You need to be logged in to search for friends and manage friend requests.</p>
          
          <div className="explore-login-buttons">
            <button onClick={() => navigate("/auth")} className="explore-login-btn login">
              Log In
            </button>
            <button onClick={() => navigate("/auth/register")} className="explore-login-btn register">
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
      <div className="explore-tabs">
        <button
          onClick={() => setActiveTab("search")}
          className={`explore-tab-btn ${activeTab === "search" ? "active" : "inactive"}`}
        >
          🔍 Search Users
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`explore-tab-btn ${activeTab === "requests" ? "active" : "inactive"}`}
        >
          📬 Requests
          {friendRequests.length > 0 && (
            <span className="explore-tab-badge">{friendRequests.length}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("friends")}
          className={`explore-tab-btn ${activeTab === "friends" ? "active" : "inactive"}`}
        >
          👥 My Friends ({friends.length})
        </button>
      </div>

      {/* Search Tab */}
      {activeTab === "search" && (
        <div className="explore-content-container">
          <h2>Search for Users</h2>
          
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by username..."
            className="explore-search-input"
          />

          {searchResults.length > 0 && (
            <div>
              {searchResults.map(user => (
                <div key={user.id} className="explore-user-card">
                  <div className="explore-user-info">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="explore-user-avatar"
                      />
                    ) : (
                      <div className="explore-user-avatar-placeholder">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="explore-user-details">
                      <strong>@{user.username}</strong>
                      <p>{user.firstName} {user.lastName}</p>
                    </div>
                  </div>
                  
                  {friendStatus[user.id] ? (
                    <span className="explore-friend-status">✓ Friends</span>
                  ) : (
                    <button
                      onClick={() => handleSendRequest(user.id)}
                      className="explore-add-friend-btn"
                    >
                      Add Friend
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {searchTerm.length >= 2 && searchResults.length === 0 && (
            <p className="explore-no-results">
              No users found matching "{searchTerm}"
            </p>
          )}
        </div>
      )}

      {/* Friend Requests Tab */}
      {activeTab === "requests" && (
        <div className="explore-content-container">
          <h2>Friend Requests</h2>

          {friendRequests.length === 0 ? (
            <p className="explore-no-results">No pending friend requests</p>
          ) : (
            friendRequests.map(request => {
              const fromUser = request.get("fromUser");
              return (
                <div key={request.id} className="explore-user-card">
                  <div className="explore-user-info">
                    {fromUser.get("profilePicture") ? (
                      <img
                        src={fromUser.get("profilePicture")}
                        alt={fromUser.get("username")}
                        className="explore-user-avatar"
                      />
                    ) : (
                      <div className="explore-user-avatar-placeholder">
                        {fromUser.get("username").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="explore-user-details">
                      <strong>@{fromUser.get("username")}</strong>
                      <p>{fromUser.get("firstName")} {fromUser.get("lastName")}</p>
                    </div>
                  </div>

                  <div className="explore-request-actions">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="explore-accept-btn"
                    >
                      ✓ Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="explore-reject-btn"
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
        <div className="explore-content-container">
          <h2>My Friends ({friends.length})</h2>

          {friends.length === 0 ? (
            <p className="explore-no-results">
              You haven't added any friends yet. Search for users to get started!
            </p>
          ) : (
            <div className="explore-friends-grid">
              {friends.map(friend => (
                <div key={friend.id} className="explore-friend-card">
                  {friend.profilePicture ? (
                    <img
                      src={friend.profilePicture}
                      alt={friend.username}
                      className="explore-friend-avatar"
                    />
                  ) : (
                    <div className="explore-friend-avatar-placeholder">
                      {friend.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <strong>@{friend.username}</strong>
                  <p>{friend.firstName} {friend.lastName}</p>
                  <button
                    onClick={() => handleRemoveFriend(friend.id)}
                    className="explore-remove-friend-btn"
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

export default Explore;