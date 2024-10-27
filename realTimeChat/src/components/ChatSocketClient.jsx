import { useState, useEffect, useRef } from 'react';
import './chatsocketclient.css';

const ChatSocketClient = () => {
  // State to hold messages received from the server
  const [messages, setMessages] = useState([]);
  // State to hold the current input value from the user
  const [input, setInput] = useState('');
  // Ref to hold the WebSocket connection
  const socketRef = useRef(null);
  // State to hold the unique user ID
  const [userId, setUserId] = useState(null);

  const setUser=()=>{
      // Create a unique ID using random characters
    const uniqueId = `user_${Math.random().toString(36).substring(2, 9)}`;
    setUserId(uniqueId);
    console.log("user id set");
  }
  const setUpSocketClient=()=>{
    
    // Connect to the WebSocket server
    socketRef.current = new WebSocket('ws://localhost:8080');

   // Event handler for when the connection is opened

    socketRef.current.onopen = () => {
      console.log('Connected to the WebSocket server');
    };
   // Event handler for recieving message, parse the 
    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data); 
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log("Received message:",messages,typeof messages);
      
    };
  //Handler when connection is closed
    socketRef.current.onclose = () => {
      console.log('Disconnected from the WebSocket server');
    };

  }

  useEffect(() => {
    setUser();
    setUpSocketClient();
 
    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

    // Function to send a message to the server
  const sendMessage = () => {
    
    const message = {
      msg:input,
      user: userId, 
    };
    console.log("message sending");
   // Check if WebSocket is open and input is not empty before sending
    if (socketRef.current && input) {
      if (socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(message)); 
        setInput('');
        console.log("Message sent:", input); 
      } else {
        console.error("WebSocket is not open. Current state:", socketRef.current.readyState);
      }
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat Room</h2>
      <div className="messages">
      {messages.map((message, index) => (
          <p key={index} className={`text-left ${message.user === userId ? 'text-right' : ''} text-lg`}>
            { message.user==userId?
           <div>{message.msg} <strong>:You </strong> </div> :
           <div> <strong>{message.user}: </strong>{message.msg}</div>
            }
          </p>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <button  onkey onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatSocketClient;
