import { useState, useEffect, useRef } from "react"
import Parse from "parse"
import { LIVE_QUERY_SERVER_URL } from "../../environments"

export const useBookClubChat = (selectedClubId, currentUser) => {
  const [messages, setMessages] = useState([])
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const subscriptionRef = useRef(null)
  const liveQueryClientRef = useRef(null)
  
  // Cleanup function definition
  const cleanupLiveQuery = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe()
      subscriptionRef.current = null
      console.log("[v1] LiveQuery subscription unsubscribed")
    }
    if (liveQueryClientRef.current) {
      liveQueryClientRef.current.close()
      liveQueryClientRef.current = null
      console.log("[v1] LiveQuery Client connection closed")
    }
  }

  // Effect for fetching and subscribing to messages
  useEffect(() => {
    if (!selectedClubId || !currentUser) {
        cleanupLiveQuery()
        setMessages([])
        return
    }

    setIsLoadingMessages(true)
    cleanupLiveQuery() // Clean up any previous client/subscription

    const fetchInitialMessages = async () => {
        const messagesQuery = new Parse.Query("Message")
        // NOTE: Assuming your 'clubId' column is a String or Pointer ID on the Message class.
        // If 'clubId' is a Pointer to the BookClub object, you must use .equalTo('clubId', clubPointerObject)
        messagesQuery.equalTo("clubId", selectedClubId) 
        messagesQuery.ascending("createdAt")
        messagesQuery.limit(100)

        try {
            const results = await messagesQuery.find()
            setMessages(results)
            setIsLoadingMessages(false)
        } catch (error) {
            console.error("Error fetching initial messages:", error)
            setIsLoadingMessages(false)
        }
    }

    const setupLiveQuery = () => {
        // 1. Initialize the LiveQuery Client explicitly
        const client = new Parse.LiveQueryClient({
            applicationId: Parse.applicationId,
            serverURL: LIVE_QUERY_SERVER_URL,
            javascriptKey: Parse.javaScriptKey,
        })
        liveQueryClientRef.current = client
        client.open()

        client.on('error', (error) => {
            console.error("[v1] LiveQuery Client Error:", error)
            alert("Could not connect to live chat. Please check your LiveQuery settings in Back4App.")
        })

        client.on('open', () => {
            console.log("[v1] LiveQuery Client Connection Established. Subscribing...")
            
            // 2. Setup the subscription
            const query = new Parse.Query("Message")
            query.equalTo("clubId", selectedClubId)

            try {
                const subscription = client.subscribe(query)
                subscriptionRef.current = subscription

                subscription.on("create", (message) => {
                    console.log("[v1] New message received via LiveQuery:", message.get("text"))
                    // Use a function update to ensure we use the latest state
                    setMessages((prev) => [...prev, message])
                })
                
                // Add handlers for update, delete, etc. if needed
                subscription.on("update", (message) => {
                    setMessages((prev) => prev.map((msg) => (msg.id === message.id ? message : msg)))
                })

            } catch (error) {
                console.error("[v1] Error subscribing to LiveQuery:", error)
            }
        })
    }

    fetchInitialMessages()
    setupLiveQuery()

    // Cleanup on unmount or dependency change
    return cleanupLiveQuery
  }, [selectedClubId, currentUser])

  return { messages, isLoadingMessages, setMessages }
}