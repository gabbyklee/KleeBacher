"use client"

import { useState, useEffect, useRef } from "react"
import Parse from "parse"
import { useNavigate } from "react-router-dom"
import { checkUser } from "../Auth/AuthService"
import { useBookClubChat } from "./useBookClubChat" // Custom hook
import "./BookClub.css"

const BookClub = () => {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [myClubs, setMyClubs] = useState([])
  const [exploreClubs, setExploreClubs] = useState([])
  const [selectedClub, setSelectedClub] = useState(null)
  const [messageText, setMessageText] = useState("")
  const messagesEndRef = useRef(null)

  // Use the new custom hook to handle chat logic
  const { 
    messages, 
    isLoadingMessages, 
  } = useBookClubChat(selectedClub?.id, currentUser) 
  
  // Scroll to bottom whenever messages array is updated
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Check authentication on mount
  useEffect(() => {
    if (!checkUser()) {
      alert("Please login to access Book Clubs")
      navigate("/auth/login")
      return
    }
    const user = Parse.User.current()
    setCurrentUser(user)
  }, [navigate])

  // Fetch clubs user is a member of and available clubs
  useEffect(() => {
    if (!currentUser) return

    const fetchClubs = async () => {
      try {
        // Fetch user's clubs
        const userClubsQuery = new Parse.Query("UserClubs")
        userClubsQuery.equalTo("userId", currentUser.id)
        userClubsQuery.include("clubId")
        const userClubResults = await userClubsQuery.find()
        const userClubIds = userClubResults.map((uc) => uc.get("clubId").id)

        if (userClubResults.length > 0) {
          const clubsData = userClubResults.map((uc) => uc.get("clubId"))
          setMyClubs(clubsData)
        }

        // Fetch all available clubs
        const allClubsQuery = new Parse.Query("BookClub")
        const allClubs = await allClubsQuery.find()

        // Filter out clubs user is already in
        const availableClubs = allClubs.filter((club) => !userClubIds.includes(club.id))
        setExploreClubs(availableClubs)
      } catch (error) {
        console.error("Error fetching clubs:", error)
      }
    }

    fetchClubs()
  }, [currentUser])
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSelectClub = (club) => {
    setSelectedClub(club)
    // Messages state is reset by the hook when selectedClub changes to null/new ID
  }

  const handleAddClub = async (club) => {
    if (!currentUser) return

    try {
      // Create UserClubs relationship
      const UserClubs = Parse.Object.extend("UserClubs")
      const userClub = new UserClubs()
      userClub.set("userId", currentUser.id) 
      userClub.set("clubId", club)
      await userClub.save()

      // Update local state
      setMyClubs([...myClubs, club])
      setExploreClubs(exploreClubs.filter((c) => c.id !== club.id))

      alert(`Successfully joined ${club.get("name")}!`)
    } catch (error) {
      console.error("Error joining club:", error)
      alert("Failed to join club")
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedClub || !currentUser) return

    try {
      const Message = Parse.Object.extend("Message")
      const message = new Message()
      message.set("clubId", selectedClub.id)
      message.set("userId", currentUser.id)
      message.set("username", currentUser.get("firstName") || currentUser.get("username"))
      message.set("text", messageText.trim())

      // When the message is saved successfully, LiveQuery handles adding it to 'messages' state.
      await message.save() 
      setMessageText("")
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Failed to send message")
    }
  }

  if (!currentUser) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="bookclub-container">
      <div className="bookclub-sidebar">
        <div className="clubs-section">
          <h2 className="section-title">My Clubs</h2>
          <div className="clubs-list">
            {/* My Clubs List Rendering */}
            {myClubs.length === 0 ? (
              <p className="empty-state">No clubs yet. Add one below!</p>
            ) : (
              myClubs.map((club) => (
                <button
                  key={club.id}
                  className={`club-item ${selectedClub?.id === club.id ? "active" : ""}`}
                  onClick={() => handleSelectClub(club)}
                >
                  <span className="club-name">{club.get("name")}</span>
                  <span className="club-action">CHAT&gt;</span>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="clubs-section">
          <h2 className="section-title">Explore</h2>
          <div className="clubs-list">
            {/* Explore Clubs List Rendering */}
            {exploreClubs.length === 0 ? (
              <p className="empty-state">No new clubs available</p>
            ) : (
              exploreClubs.map((club) => (
                <button key={club.id} className="club-item explore-item" onClick={() => handleAddClub(club)}>
                  <span className="club-name">{club.get("name")}</span>
                  <span className="club-action add-action">+ADD</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="chat-container">
        {selectedClub ? (
          <>
            <div className="chat-header">
              <h1>{selectedClub.get("name")}</h1>
            </div>

            {/* Display loading state for messages */}
            {isLoadingMessages && messages.length === 0 ? (
                <div className="messages-container loading-state">Loading chat history...</div>
            ) : (
                <div className="messages-container">
                {/* Messages Rendering */}
                {messages.map((message, index) => {
                    const timestamp = message.get("createdAt")
                    const timeString = timestamp
                      ? new Date(timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""

                    return (
                      <div
                        key={message.id || index}
                        className={`message ${message.get("userId") === currentUser.id ? "own-message" : ""}`}
                      >
                        <div className="message-header">
                          <span className="message-username">{message.get("username")}</span>
                          <span className="message-time">{timeString}</span>
                        </div>
                        <span className="message-text">{message.get("text")}</span>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
            )}


            <form className="message-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="message-input"
                placeholder="enter message here"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <button type="submit" className="send-button">
                SEND
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <h2>Select a club to start chatting</h2>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookClub