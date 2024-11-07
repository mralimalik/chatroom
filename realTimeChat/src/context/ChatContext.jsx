import { useState, useEffect, createContext, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  // State to hold messages received from the server
  const [messages, setMessages] = useState([]);
  // holds the conversationId between two users
  const conversationId = useRef("");


  // Ref to hold the WebSocket connection
  const socketRef = useRef(null);

  const [onlineUsers, setOnlineUsers] = useState([]);

  const setUpSocketClient = (userData) => {
    // Connect to the WebSocket server
    socketRef.current = new WebSocket("ws://localhost:8080");

    // Event handler for when the connection is opened
    socketRef.current.onopen = () => {
      // Send the user ID to the server after connection is established
      socketRef.current.send(
        JSON.stringify({
          type: "register",
          userId: userData.current._id,
        })
      );
      console.log("Connected to the WebSocket server", userData.current._id);
    };
    // Event handler for recieving message, parse the
    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message from server:", message, typeof message);

      if (message.type === "onlineUsers") {
        setOnlineUsers(message.onlineUsers);
        console.log("getting Online users:", message.onlineUsers);
      } else if (message.type === "register") {
        console.log("sending userid id to server");
      } else {
        // Check if the message belongs to the current conversation
        if (message.conversationId === conversationId.current) {
          console.log(
            "MEessage recieved",
            message.conversationId,
            "conversation id",
            conversationId.current
          );
          setMessages((prevMessages) => [...prevMessages, message]);
        }
        // Check if the incoming message is from another user
        if (userData.current._id === message.receiver) {
          console.log("User id from meesage", message.sender._id);
          showNotification(message.sender.name, message.message);
        } else {
          console.log("Received my own message, no notification shown.");
        }
    
      }
    };
    //Handler when connection is closed
    socketRef.current.onclose = () => {
      console.log("Disconnected from the WebSocket server");
    };
  };

  //Create conversation between two users if not exist else return conversation id
  const createConversation = async (currentUserId, otherUserId) => {
    // Make a POST request to the server
    const response = await axios.post(
      "http://localhost:3000/convo/create",
      {
        currentUserId,
        otherUserId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("conversation id ", response.data.conversation);

    conversationId.current = response.data.conversation._id;
    await fetchMessages();
  };

  // Function to fetch messages for a specific conversation
  const fetchMessages = async () => {
    try {
      console.log(conversationId.current);
      const response = await axios.get(
        `http://localhost:3000/convo/${conversationId.current}`
      );
      setMessages(response.data.messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // request permission for notification
  const requestPermission = () => {
    if (
      Notification.permission === "default" ||
      Notification.permission === "denied"
    ) {
      Notification.requestPermission().then((permissin) => {
        if (permissin === "granted") {
          console.log("User granted permission for notification");
        } else {
          console.log("User did not granted permission for notification");
        }
      });
    } else {
      console.log("User accepted already");
    }
  };

  // show notification of message to reciever
  const showNotification = (sender, message) => {
    if (Notification.permission === "granted") {
      console.log("Sending notification");
      new Notification(`Hey, you got the message from ${sender}`, {
        body: message,
        silent: false,
      });
      console.log("Notification sent");
    } else {
      console.log("User did not granted permissin");
    }
  };



  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <ChatContext.Provider
      value={{
        createConversation,
        messages,
        setMessages,
        conversationId,
        showNotification,
        socketRef,
        setUpSocketClient,
        onlineUsers,
        setOnlineUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
