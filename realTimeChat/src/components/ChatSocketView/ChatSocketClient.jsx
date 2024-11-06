import { useState, useEffect, useRef, useContext } from "react";
import "./chatsocketclient.css";
import { AuthContext } from "../../context/AuthContext.jsx";

import axios from "axios";

const ChatSocketClient = ({ friendId, name }) => {
  // get current user data from context
  const { userData } = useContext(AuthContext);
  // State to hold messages received from the server
  const [messages, setMessages] = useState([]);
  // State to hold the current input value from the user
  const [input, setInput] = useState("");
  // Ref to hold the WebSocket connection
  const socketRef = useRef(null);
  // holds the conversationId between two users
  const conversationId = useRef("");

  const setUpSocketClient = () => {
    // Connect to the WebSocket server
    socketRef.current = new WebSocket("ws://localhost:8080");

    // Event handler for when the connection is opened
    socketRef.current.onopen = () => {
      console.log("Connected to the WebSocket server");
    };
    // Event handler for recieving message, parse the
    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message from server:", message, typeof message);

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
    };
    //Handler when connection is closed
    socketRef.current.onclose = () => {
      console.log("Disconnected from the WebSocket server");
    };
  };

  // Function to send a message to the server
  const sendMessage = async () => {
    const message = {
      message: input,
      conversationId: conversationId.current,
      sender: {
        _id: userData.current._id,
        name: name,
      },
      receiver: friendId,
    };
    console.log("message sending");
    // Check if WebSocket is open and input is not empty before sending
    if (socketRef.current && input) {
      if (socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(message));
        setInput("");
        await sendMessageToDatabase();
        console.log("Message sent:", message);
      } else {
        console.error(
          "WebSocket is not open. Current state:",
          socketRef.current.readyState
        );
      }
    }
  };

  // Function to send a message to the database
  const sendMessageToDatabase = async () => {
    try {
      // Make a POST request to the server
      const response = await axios.post(
        "http://localhost:3000/convo/sendMessage",
        {
          message: input,
          conversation: conversationId.current,
          sender: userData.current._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Optionally, you might want to do something with the response
      console.log("Message sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

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

  useEffect(() => {
    setMessages([]);
    createConversation(userData.current._id, friendId);
  }, [friendId]);

  useEffect(() => {
    setUpSocketClient();
    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${
              message.sender._id === userData.current._id
                ? "justify-end"
                : "justify-start"
            } items-end text-lg`}
          >
            {message.sender._id !== userData.current._id && (
              <div
                className="user-image bg-red-300"
                style={{
                  backgroundImage: `url(${message.image})`,
                }}
              ></div>
            )}

            <div
              className={`message-info ${
                message.sender._id === userData.current._id
                  ? "text-right"
                  : "text-left"
              } 
            ${
              message.sender._id === userData.current._id
                ? "user-radius"
                : "non-user-radius"
            } 
            `}
            >
              <p className="font-bold">
                {message.sender._id === userData.current._id
                  ? "Me"
                  : message.sender.name}
              </p>
              <p>{message.message}</p>
            </div>
            {message.sender._id === userData.current._id && (
              <div
                className="user-image  bg-gray-600"
                style={{
                  backgroundImage: `url('')`,
                }}
              ></div>
            )}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <img
          onClick={sendMessage}
          src={""}
          alt=""
          style={{ width: "25px", height: "25px" }}
        />
      </div>
    </div>
  );
};

export default ChatSocketClient;
