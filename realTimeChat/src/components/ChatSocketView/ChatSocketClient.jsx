import { useState, useEffect, useRef, useContext } from "react";
import "./chatsocketclient.css";
import { AuthContext } from "../../context/AuthContext.jsx";
import { ChatContext } from "../../context/ChatContext.jsx";
import axios from "axios";

const ChatSocketClient = ({ friendId, name }) => {
  // get current user data from context
  const { userData } = useContext(AuthContext);

  // variables functions in chat context
  const {
    createConversation,
    messages,
    setMessages,
    conversationId,
    showNotification,
    socketRef,
    setUpSocketClient
  } = useContext(ChatContext);

  const [input, setInput] = useState("");




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

  useEffect(() => {
    setMessages([]);
    createConversation(userData.current._id, friendId);
  }, [friendId]);



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
