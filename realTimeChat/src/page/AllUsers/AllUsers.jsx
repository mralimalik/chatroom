import React from "react";
import ChatSocketClient from "../../components/ChatSocketView/ChatSocketClient";
import Navbar from "../../components/Navbar/Navbar";
import "./AllUsers.css";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserData, setSelectedUserData] = useState({});

  const { userData } = useContext(AuthContext);

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
  }, []);

  return (
    <div className="chat-screen">
      <div className="user-list">
        {users.map((user) => (
          <div className="list-item" key={user.id}>
            <div
              className="user-item"
              onClick={() => setSelectedUserData(user)}
            >
              {/* <img className="avatar" src={user.avatar} alt={user.name} height={60} width={60}/> */}
              <div className="user-name">{user.name}</div>
            </div>

            <div className="list-divider"></div>
          </div>
        ))}
      </div>
      {Object.keys(selectedUserData).length > 0 && ( // Check if userData is not empty
        <div className="chat-container">
          <Navbar username={selectedUserData.name || ""} />
          <ChatSocketClient
            friendId={selectedUserData._id}
            name={selectedUserData.name}
          />
        </div>
      )}
    </div>
  );
};

export default AllUsers;
