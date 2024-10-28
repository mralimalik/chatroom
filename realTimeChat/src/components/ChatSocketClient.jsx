import { useState, useEffect, useRef } from "react";
import "./chatsocketclient.css";
import pic1 from '../assets/pic1.png';
import pic2 from '../assets/pic2.png';
import pic3 from '../assets/pic3.png';
import send from '../assets/send.png';

const ChatSocketClient = () => {
  // State to hold messages received from the server
  const [messages, setMessages] = useState([]);
  // State to hold the current input value from the user
  const [input, setInput] = useState("");
  // Ref to hold the WebSocket connection
  const socketRef = useRef(null);
  // State to hold the unique user ID
  const userIdRef = useRef(null);

  const userImageRef = useRef(null);

  const images = [pic1, pic2, pic3];

  const setUser = () => {
    // Create a unique ID using random characters
    const uniqueId = `user_${Math.random().toString(36).substring(2, 9)}`;
    userIdRef.current = uniqueId;

     // Randomly select an image from the images array
     const randomIndex = Math.floor(Math.random() * images.length);
     userImageRef.current = images[randomIndex];
 
    console.log("user id set", userIdRef.current);
  };
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
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log("Received message:", messages, typeof messages);
      // Check if the incoming message is from another user
      if (userIdRef.current !== message.user) {
        console.log("User id ", userIdRef.current);
        console.log("User id from meesage", message.user);
        showNotification(message.user, message.msg);
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
  const sendMessage = () => {
    const message = {
      msg: input,
      user: userIdRef.current,
      image: userImageRef.current,
    };
    console.log("message sending");
    // Check if WebSocket is open and input is not empty before sending
    if (socketRef.current && input) {
      if (socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(message));
        setInput("");
        console.log("user id in input ", userIdRef.current);
        console.log("Message sent:", input);
      } else {
        console.error(
          "WebSocket is not open. Current state:",
          socketRef.current.readyState
        );
      }
    }
  };

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
    console.log("USer effect calling");
    setUser();
    setUpSocketClient();
    requestPermission();

    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  return (
    <div className="chat-container">
      <div className="messages">
    
        {messages.map((message, index) => (
          <div key={index}
            className={`${
              message.user === userIdRef.current
                ? "justify-end"
                : "justify-start"
            } items-end text-lg`}  >

            {message.user !== userIdRef.current && (
              <div className="user-image bg-red-300"  
                style={
                {
                  backgroundImage: `url(${message.image})`, 
                  
                }
               }
            ></div>
            )}

            <div className={`message-info ${
              message.user === userIdRef.current
                ? "text-right"
                : "text-left"
            } 
            ${
              message.user === userIdRef.current
                ? "user-radius"
                : "non-user-radius"
            } 
            `}>
            <p className="font-bold">{message.user}</p>
            <p >{message.msg}</p>
            </div>
            {message.user === userIdRef.current && (
              <div className="user-image  bg-gray-600"
               style={
                {
                  backgroundImage: `url(${userImageRef.current})`, 
                 
                }
               }>
              </div>
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
        <img onClick={sendMessage}src={send} alt="" style={{ width: '25px', height: '25px' }} />
      </div>
    </div>
  );
};

export default ChatSocketClient;
