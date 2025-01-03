import React from "react";
import ChatSocketClient from "../../components/ChatSocketView/ChatSocketClient";
import Navbar from "../../components/Navbar/Navbar";
import "./AllUsers.css";
import axios from "axios";
import { useState, useEffect, useContext, useMemo } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { ChatContext } from "../../context/ChatContext.jsx";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserData, setSelectedUserData] = useState({});

  const [selectedUserId, setSelectedUserId] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const { userData } = useContext(AuthContext);

  // variables functions in chat context
  const { socketRef, setUpSocketClient, onlineUsers, setOnlineUsers } =
    useContext(ChatContext);

  // Function to get users from the API
  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users/getUsers");
      if (response.status === 200) {
        const filteredUsers = response.data.filter(
          (user) => user._id !== userData.current._id
        ); // Filter out the logged-in user
        setUsers(filteredUsers); // Assuming the data is an array of user objects
      } else {
        console.error("Failed to fetch users: ", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  useEffect(() => {
    getUsers();
    setUpSocketClient(userData);
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  return (
    <div className="chat-screen">
      <div className="user-list">
        <p>All User Chats</p>

        <div className="input-container">
          <input
            type="text"
            placeholder="Search User"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
          />
        </div>

        {filteredUsers.map((user, index) => (
          <div className={`list-item`} key={user.id}>
            <div
              className={`user-item ${
                selectedUserId === user._id ? "user-selected" : ""
              }`}
              onClick={() => {
                setSelectedUserData(user);
                setSelectedUserId(user._id);
                console.log(user._id);
              }}
            >
              <div className="avatar"></div>

              <div className="user-name">{user.name}</div>
            </div>
            {/* <div className="list-divider"></div> */}
          </div>
        ))}
      </div>
      {Object.keys(selectedUserData).length > 0 ? ( // Check if userData is not empty
        <div className="chat-containers">
          <Navbar
            username={selectedUserData.name || ""}
            online={
              onlineUsers.includes(selectedUserData._id) ? "Online" : "Offline"
            }
          />
          <ChatSocketClient
            friendId={selectedUserData._id}
            name={selectedUserData.name}
          />
        </div>
      ) : (
        <div className="no-selected-chat-container">
          <p>NO CHAT SELECTED</p>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
